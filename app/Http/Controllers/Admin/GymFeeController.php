<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreGymFeeRequest;
use App\Models\MembershipPackage;
use App\Models\MembershipPackagePrice;
use App\Services\ActivityLogService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class GymFeeController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->query('search');

        $query = MembershipPackage::with('prices');

        if ($search) {
            $query->where('package_name', 'like', "%{$search}%");
        }

        $packages = $query
            ->orderBy('package_name')
            ->get()
            ->map(fn (MembershipPackage $p) => [
                'id' => $p->id,
                'packageName' => $p->package_name,
                'registrationFee' => (int) $p->registration_fee,
                'description' => $p->description,
                'isActive' => $p->is_active,
                'prices' => $p->prices->map(fn (MembershipPackagePrice $pr) => [
                    'id' => $pr->id,
                    'durationMonths' => $pr->duration_months,
                    'price' => (int) $pr->price,
                ]),
                'priceCount' => $p->prices->count(),
                'minPrice' => (int) ($p->prices->min('price') ?? 0),
                'maxPrice' => (int) ($p->prices->max('price') ?? 0),
            ]);

        $stats = [
            'total' => MembershipPackage::count(),
            'active' => MembershipPackage::where('is_active', true)->count(),
            'inactive' => MembershipPackage::where('is_active', false)->count(),
        ];

        return Inertia::render('admin/GymFee', [
            'packages' => $packages,
            'stats' => $stats,
        ]);
    }

    public function store(StoreGymFeeRequest $request): RedirectResponse
    {
        $package = MembershipPackage::create([
            'package_name' => $request->input('packageName'),
            'registration_fee' => $request->input('registrationFee', 0),
            'description' => $request->input('description'),
            'is_active' => $request->boolean('isActive', true),
        ]);

        foreach ($request->input('prices', []) as $price) {
            MembershipPackagePrice::create([
                'package_id' => $package->id,
                'duration_months' => $price['durationMonths'],
                'price' => $price['price'],
            ]);
        }

        ActivityLogService::log(
            activityType: 'pembayaran',
            activityName: 'Tambah Paket: '.$package->package_name,
            description: 'Menambahkan paket gym baru "'.$package->package_name.'"',
            referenceTable: 'membership_packages',
            referenceId: $package->id,
        );

        return redirect()->route('admin.gym-fee')->with('success', 'Data paket gym berhasil disimpan!');
    }

    public function show(MembershipPackage $gymFee): JsonResponse
    {
        $gymFee->load('prices');

        return response()->json([
            'id' => $gymFee->id,
            'packageName' => $gymFee->package_name,
            'registrationFee' => (int) $gymFee->registration_fee,
            'description' => $gymFee->description,
            'isActive' => $gymFee->is_active,
            'prices' => $gymFee->prices->map(fn (MembershipPackagePrice $pr) => [
                'id' => $pr->id,
                'durationMonths' => $pr->duration_months,
                'price' => (int) $pr->price,
            ]),
        ]);
    }

    public function update(StoreGymFeeRequest $request, MembershipPackage $gymFee): RedirectResponse
    {
        $gymFee->update([
            'package_name' => $request->input('packageName'),
            'registration_fee' => $request->input('registrationFee', 0),
            'description' => $request->input('description'),
            'is_active' => $request->boolean('isActive', true),
        ]);

        $submittedPriceIds = collect($request->input('prices', []))
            ->filter(fn ($p) => ! empty($p['id']))
            ->pluck('id')
            ->toArray();

        MembershipPackagePrice::where('package_id', $gymFee->id)
            ->whereNotIn('id', $submittedPriceIds)
            ->delete();

        foreach ($request->input('prices', []) as $price) {
            if (! empty($price['id'])) {
                MembershipPackagePrice::where('id', $price['id'])
                    ->where('package_id', $gymFee->id)
                    ->update([
                        'duration_months' => $price['durationMonths'],
                        'price' => $price['price'],
                    ]);
            } else {
                MembershipPackagePrice::create([
                    'package_id' => $gymFee->id,
                    'duration_months' => $price['durationMonths'],
                    'price' => $price['price'],
                ]);
            }
        }

        ActivityLogService::log(
            activityType: 'pembayaran',
            activityName: 'Update Paket: '.$gymFee->package_name,
            description: 'Memperbarui paket gym "'.$gymFee->package_name.'"',
            referenceTable: 'membership_packages',
            referenceId: $gymFee->id,
        );

        return redirect()->route('admin.gym-fee')->with('success', 'Data paket gym berhasil diperbarui!');
    }

    public function destroy(MembershipPackage $gymFee): RedirectResponse
    {
        ActivityLogService::log(
            activityType: 'lainnya',
            activityName: 'Hapus Paket: '.$gymFee->package_name,
            description: 'Menghapus paket gym "'.$gymFee->package_name.'"',
            referenceTable: 'membership_packages',
            referenceId: $gymFee->id,
        );

        $gymFee->delete();

        return redirect()->route('admin.gym-fee')->with('success', 'Data paket gym berhasil dihapus!');
    }
}
