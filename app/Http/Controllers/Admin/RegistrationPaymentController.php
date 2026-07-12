<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreRegistrationPaymentRequest;
use App\Models\Member;
use App\Models\MemberMembership;
use App\Models\MembershipPackage;
use App\Models\MembershipPackagePrice;
use App\Models\RegistrationPayment;
use App\Services\ActivityLogService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class RegistrationPaymentController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->query('search');
        $status = $request->query('status');
        $packageId = $request->query('package');

        $query = RegistrationPayment::with('member', 'package', 'creator');

        if ($search) {
            $query->whereHas('member', function ($q) use ($search) {
                $q->where('full_name', 'like', "%{$search}%")
                    ->orWhere('member_code', 'like', "%{$search}%");
            });
        }

        if ($status) {
            $query->where('payment_status', $status);
        }

        if ($packageId) {
            $query->where('package_id', $packageId);
        }

        $payments = $query
            ->latest()
            ->paginate(10)
            ->through(function (RegistrationPayment $rp) {
                $ms = MemberMembership::where('member_id', $rp->member_id)
                    ->where('package_id', $rp->package_id)
                    ->latest()
                    ->first();

                return [
                    'id' => $rp->id,
                    'memberCode' => $rp->member?->member_code ?? '-',
                    'memberName' => $rp->member?->full_name ?? '-',
                    'packageName' => $rp->package?->package_name ?? '-',
                    'durationMonths' => $ms?->duration_months ?? 0,
                    'startDate' => $ms?->start_date?->format('d M Y') ?? '-',
                    'endDate' => $ms?->end_date?->format('d M Y') ?? '-',
                    'registrationDate' => $rp->registration_date->format('d M Y'),
                    'registrationFee' => (int) $rp->registration_fee,
                    'amount' => (int) ($ms?->amount ?? 0),
                    'adminFee' => (int) $rp->admin_fee,
                    'totalFee' => (int) $rp->registration_fee + (int) ($ms?->amount ?? 0) + (int) $rp->admin_fee,
                    'paymentMethod' => $rp->payment_method,
                    'paymentStatus' => $rp->payment_status,
                    'createdBy' => $rp->creator?->full_name ?? 'Sistem',
                ];
            });

        $revenue = (int) RegistrationPayment::where('payment_status', 'paid')
            ->sum(DB::raw('registration_fee + admin_fee'));

        $newThisMonth = RegistrationPayment::whereYear('registration_date', now()->year)
            ->whereMonth('registration_date', now()->month)
            ->count();

        $topPackage = RegistrationPayment::selectRaw('package_id, count(*) as total')
            ->groupBy('package_id')
            ->orderByDesc('total')
            ->with('package:id,package_name')
            ->first();

        $stats = [
            'revenue' => $revenue,
            'newThisMonth' => $newThisMonth,
            'topPackageName' => $topPackage?->package?->package_name ?? '-',
            'topPackageCount' => (int) ($topPackage?->total ?? 0),
        ];

        $members = Member::orderBy('full_name')
            ->get()
            ->map(fn (Member $m) => [
                'id' => $m->id,
                'memberCode' => $m->member_code,
                'fullName' => $m->full_name,
            ]);

        $packages = MembershipPackage::with('prices')
            ->where('is_active', true)
            ->orderBy('package_name')
            ->get()
            ->map(fn (MembershipPackage $p) => [
                'id' => $p->id,
                'packageName' => $p->package_name,
                'registrationFee' => (int) $p->registration_fee,
                'prices' => $p->prices->map(fn (MembershipPackagePrice $pr) => [
                    'durationMonths' => $pr->duration_months,
                    'price' => (int) $pr->price,
                ]),
            ]);

        return Inertia::render('admin/RegistrationPayment', [
            'payments' => $payments,
            'stats' => $stats,
            'members' => $members,
            'packages' => $packages,
        ]);
    }

    public function store(StoreRegistrationPaymentRequest $request): RedirectResponse
    {
        $startDate = $request->date('startDate');
        $durationMonths = (int) $request->input('durationMonths');
        $endDate = $startDate->copy()->addMonths($durationMonths);
        $memberId = (int) $request->input('memberId');

        RegistrationPayment::create([
            'member_id' => $memberId,
            'package_id' => $request->input('packageId'),
            'registration_date' => $request->date('registrationDate')->toDateString(),
            'registration_fee' => $request->input('registrationFee'),
            'admin_fee' => $request->input('adminFee', 0),
            'payment_method' => $request->input('paymentMethod'),
            'payment_status' => $request->input('paymentStatus', 'unpaid'),
            'notes' => $request->input('notes'),
            'created_by' => $request->user()?->id,
        ]);

        $paidAt = $request->input('paymentStatus') === 'paid' ? now() : null;

        MemberMembership::create([
            'member_id' => $memberId,
            'package_id' => $request->input('packageId'),
            'duration_months' => $durationMonths,
            'start_date' => $startDate->toDateString(),
            'end_date' => $endDate->toDateString(),
            'amount' => $request->input('amount', 0),
            'admin_fee' => $request->input('adminFee', 0),
            'payment_method' => $request->input('paymentMethod'),
            'payment_status' => $request->input('paymentStatus', 'unpaid'),
            'paid_at' => $paidAt,
            'status' => 'active',
            'notes' => $request->input('notes'),
            'created_by' => $request->user()?->id,
        ]);

        Member::where('id', $memberId)->update(['member_status' => 'active']);

        $member = Member::find($memberId);

        ActivityLogService::log(
            activityType: 'pembayaran',
            activityName: 'Tambah Pembayaran: '.($member?->full_name ?? 'Unknown'),
            description: 'Menambahkan pembayaran pendaftaran member "'.($member?->full_name ?? 'Unknown').'" ('.$member?->member_code.')',
            memberId: $memberId,
            referenceTable: 'registration_payments',
            referenceId: $memberId,
        );

        return redirect()->route('admin.registration-payment')->with('success', 'Data biaya pendaftaran berhasil disimpan!');
    }

    public function show(RegistrationPayment $registrationPayment): JsonResponse
    {
        $registrationPayment->load('member', 'package', 'creator');

        $ms = MemberMembership::where('member_id', $registrationPayment->member_id)
            ->where('package_id', $registrationPayment->package_id)
            ->latest()
            ->first();

        return response()->json([
            'id' => $registrationPayment->id,
            'memberId' => $registrationPayment->member_id,
            'memberCode' => $registrationPayment->member?->member_code ?? '-',
            'memberName' => $registrationPayment->member?->full_name ?? '-',
            'packageId' => $registrationPayment->package_id,
            'packageName' => $registrationPayment->package?->package_name ?? '-',
            'durationMonths' => $ms?->duration_months ?? 0,
            'startDate' => $ms?->start_date?->toDateString() ?? $registrationPayment->registration_date->toDateString(),
            'endDate' => $ms?->end_date?->format('d M Y') ?? '-',
            'registrationDate' => $registrationPayment->registration_date->toDateString(),
            'registrationFee' => (int) $registrationPayment->registration_fee,
            'amount' => (int) ($ms?->amount ?? 0),
            'adminFee' => (int) $registrationPayment->admin_fee,
            'totalFee' => (int) $registrationPayment->registration_fee + (int) ($ms?->amount ?? 0) + (int) $registrationPayment->admin_fee,
            'paymentMethod' => $registrationPayment->payment_method,
            'paymentStatus' => $registrationPayment->payment_status,
            'paidAt' => $ms?->paid_at?->format('Y-m-d H:i'),
            'notes' => $registrationPayment->notes,
            'createdBy' => $registrationPayment->creator?->full_name ?? 'Sistem',
            'createdAt' => $registrationPayment->created_at->format('d M Y H:i'),
        ]);
    }

    public function update(StoreRegistrationPaymentRequest $request, RegistrationPayment $registrationPayment): RedirectResponse
    {
        $startDate = $request->date('startDate');
        $durationMonths = (int) $request->input('durationMonths');
        $endDate = $startDate->copy()->addMonths($durationMonths);
        $paidAt = $request->input('paymentStatus') === 'paid' ? now() : null;

        $registrationPayment->update([
            'member_id' => $request->input('memberId'),
            'package_id' => $request->input('packageId'),
            'registration_date' => $request->date('registrationDate')->toDateString(),
            'registration_fee' => $request->input('registrationFee'),
            'admin_fee' => $request->input('adminFee', 0),
            'payment_method' => $request->input('paymentMethod'),
            'payment_status' => $request->input('paymentStatus', 'unpaid'),
            'notes' => $request->input('notes'),
        ]);

        $ms = MemberMembership::where('member_id', $registrationPayment->member_id)
            ->where('package_id', $registrationPayment->package_id)
            ->latest()
            ->first();

        if ($ms) {
            $ms->update([
                'package_id' => $request->input('packageId'),
                'duration_months' => $durationMonths,
                'start_date' => $startDate->toDateString(),
                'end_date' => $endDate->toDateString(),
                'amount' => $request->input('amount', 0),
                'admin_fee' => $request->input('adminFee', 0),
                'payment_method' => $request->input('paymentMethod'),
                'payment_status' => $request->input('paymentStatus', 'unpaid'),
                'paid_at' => $paidAt,
                'notes' => $request->input('notes'),
            ]);
        }

        ActivityLogService::log(
            activityType: 'pembayaran',
            activityName: 'Update Pembayaran: '.($registrationPayment->member?->full_name ?? 'Unknown'),
            description: 'Memperbarui data pembayaran pendaftaran member "'.($registrationPayment->member?->full_name ?? 'Unknown').'"',
            memberId: $registrationPayment->member_id,
            referenceTable: 'registration_payments',
            referenceId: $registrationPayment->id,
        );

        return redirect()->route('admin.registration-payment')->with('success', 'Data biaya pendaftaran berhasil diperbarui!');
    }

    public function destroy(RegistrationPayment $registrationPayment): RedirectResponse
    {
        $memberId = $registrationPayment->member_id;

        ActivityLogService::log(
            activityType: 'lainnya',
            activityName: 'Hapus Pembayaran: '.($registrationPayment->member?->full_name ?? 'Unknown'),
            description: 'Menghapus data pembayaran pendaftaran member "'.($registrationPayment->member?->full_name ?? 'Unknown').'"',
            memberId: $memberId,
            referenceTable: 'registration_payments',
            referenceId: $registrationPayment->id,
        );

        MemberMembership::where('member_id', $memberId)
            ->where('package_id', $registrationPayment->package_id)
            ->delete();

        $registrationPayment->delete();

        Member::where('id', $memberId)->update(['member_status' => 'inactive']);

        return redirect()->route('admin.registration-payment')->with('success', 'Data biaya pendaftaran berhasil dihapus!');
    }
}
