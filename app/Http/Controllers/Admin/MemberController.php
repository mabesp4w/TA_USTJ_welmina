<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreMemberRequest;
use App\Http\Requests\Admin\UpdateMemberRequest;
use App\Models\Member;
use App\Models\MemberMembership;
use App\Models\MembershipPackage;
use App\Models\MembershipPackagePrice;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MemberController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->query('search');
        $status = $request->query('status');

        $query = Member::with('memberships.package');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('full_name', 'like', "%{$search}%")
                    ->orWhere('member_code', 'like', "%{$search}%")
                    ->orWhere('identity_no', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        if ($status === 'Aktif') {
            $query->where('member_status', 'active');
        } elseif ($status === 'Nonaktif') {
            $query->where('member_status', 'inactive');
        }

        $members = $query
            ->latest()
            ->get()
            ->map(fn (Member $member) => [
                'id' => $member->id,
                'memberCode' => $member->member_code,
                'name' => $member->full_name,
                'plan' => $member->memberships->last()?->package?->package_name ?? '-',
                'period' => $member->memberships->last()
                    ? sprintf(
                        'Bergabung %s - Exp %s',
                        $member->memberships->last()->start_date->format('d M Y'),
                        $member->memberships->last()->end_date->format('d M Y'),
                    )
                    : '-',
                'status' => $member->member_status === 'active' ? 'Aktif' : 'Nonaktif',
            ]);

        $total = Member::count();
        $active = Member::where('member_status', 'active')->count();
        $expiring = MemberMembership::where('status', 'active')
            ->whereBetween('end_date', [now(), now()->addDays(7)])
            ->count();
        $inactive = Member::where('member_status', 'inactive')->count();

        $packages = MembershipPackage::with('prices')->where('is_active', true)->get()->map(
            fn (MembershipPackage $p) => [
                'id' => $p->id,
                'packageName' => $p->package_name,
                'registrationFee' => (int) $p->registration_fee,
                'prices' => $p->prices->map(fn (MembershipPackagePrice $pr) => [
                    'durationMonths' => $pr->duration_months,
                    'price' => (int) $pr->price,
                ]),
            ],
        );

        return Inertia::render('admin/Member', [
            'stats' => [
                ['title' => 'Total Member', 'value' => (string) $total, 'subtitle' => 'Terdaftar di sistem'],
                ['title' => 'Aktif', 'value' => (string) $active, 'subtitle' => 'Masa berlaku aktif'],
                ['title' => 'Aktif Expired', 'value' => (string) $expiring, 'subtitle' => 'Dalam 7 hari ke depan'],
                ['title' => 'Nonaktif', 'value' => (string) $inactive, 'subtitle' => 'Masa berlaku habis'],
            ],
            'members' => $members,
            'packages' => $packages,
        ]);
    }

    public function store(StoreMemberRequest $request): RedirectResponse
    {
        $birthDate = $request->date('birthDate');
        $startDate = $request->date('startDate');
        $durationMonths = (int) $request->input('durationMonths');
        $endDate = $startDate->copy()->addMonths($durationMonths);

        $member = Member::create([
            'member_code' => $this->generateMemberCode(),
            'full_name' => $request->input('fullName'),
            'identity_no' => $request->input('identityNo'),
            'phone' => $request->input('phone'),
            'birth_date' => $birthDate?->toDateString(),
            'gender' => $request->input('gender'),
            'email' => $request->input('email'),
            'address' => $request->input('address'),
            'member_status' => 'active',
            'joined_at' => now(),
            'created_by' => $request->user()?->id,
        ]);

        MemberMembership::create([
            'member_id' => $member->id,
            'package_id' => $request->input('packageId'),
            'duration_months' => $durationMonths,
            'start_date' => $startDate->toDateString(),
            'end_date' => $endDate->toDateString(),
            'status' => 'active',
            'created_by' => $request->user()?->id,
        ]);

        return redirect()->route('admin.member')->with('success', 'Data member berhasil disimpan!');
    }

    public function show(Member $member): JsonResponse
    {
        $member->load('memberships.package', 'creator');

        return response()->json([
            'member' => [
                'id' => $member->id,
                'memberCode' => $member->member_code,
                'fullName' => $member->full_name,
                'identityNo' => $member->identity_no,
                'phone' => $member->phone,
                'birthDate' => $member->birth_date?->format('Y-m-d'),
                'gender' => $member->gender,
                'email' => $member->email,
                'address' => $member->address,
                'memberStatus' => $member->member_status,
                'joinedAt' => $member->joined_at->format('d M Y'),
                'createdBy' => $member->creator?->full_name,
            ],
            'membership' => $member->memberships->last() ? [
                'packageName' => $member->memberships->last()->package?->package_name,
                'durationMonths' => $member->memberships->last()->duration_months,
                'startDate' => $member->memberships->last()->start_date->format('d M Y'),
                'endDate' => $member->memberships->last()->end_date->format('d M Y'),
                'status' => $member->memberships->last()->status,
            ] : null,
        ]);
    }

    public function update(UpdateMemberRequest $request, Member $member): RedirectResponse
    {
        $birthDate = $request->date('birthDate');

        $member->update([
            'full_name' => $request->input('fullName'),
            'identity_no' => $request->input('identityNo'),
            'phone' => $request->input('phone'),
            'birth_date' => $birthDate?->toDateString(),
            'gender' => $request->input('gender'),
            'email' => $request->input('email'),
            'address' => $request->input('address'),
            'member_status' => $request->input('memberStatus', $member->member_status),
        ]);

        return redirect()->route('admin.member')->with('success', 'Data member berhasil diperbarui!');
    }

    public function destroy(Member $member): RedirectResponse
    {
        $member->delete();

        return redirect()->route('admin.member')->with('success', 'Data member berhasil dihapus!');
    }

    protected function generateMemberCode(): string
    {
        $prefix = 'MB-';
        $last = Member::where('member_code', 'like', "$prefix%")
            ->orderBy('id', 'desc')
            ->value('member_code');

        if (! $last) {
            return $prefix.'0001';
        }

        $num = (int) substr($last, 3) + 1;

        return $prefix.str_pad((string) $num, 4, '0', STR_PAD_LEFT);
    }
}
