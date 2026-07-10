<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\InventoryCategory;
use App\Models\InventoryItem;
use App\Models\MaintenanceLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->query('search');

        $total = InventoryItem::count();
        $baik = InventoryItem::where('item_condition', 'baik')->count();
        $perluPerawatan = InventoryItem::where('item_condition', 'perlu_perawatan')->count();
        $rusak = InventoryItem::where('item_condition', 'rusak')->count();

        $categories = InventoryCategory::withCount('items')
            ->orderByDesc('items_count')
            ->get()
            ->map(fn (InventoryCategory $c) => [
                'name' => $c->category_name,
                'meta' => $c->items_count.' barang',
            ]);

        $activities = ActivityLog::latest()
            ->take(5)
            ->get()
            ->map(fn (ActivityLog $log) => [
                'name' => $log->activity_name,
                'meta' => $log->activity_time->diffForHumans(),
            ]);

        $maintenance = MaintenanceLog::with('inventoryItem')
            ->latest('maintenance_date')
            ->take(5)
            ->get()
            ->map(fn (MaintenanceLog $log) => [
                'name' => $log->inventoryItem?->item_name ?? '-',
                'meta' => match ($log->maintenance_type) {
                    'perbaikan' => 'Perbaikan',
                    'perawatan' => 'Perawatan rutin',
                    'pemeriksaan' => 'Pemeriksaan',
                    default => $log->maintenance_type,
                },
            ]);

        $aktif = InventoryItem::where('item_status', 'aktif')->count();
        $barangBaru = InventoryItem::where('created_at', '>=', now()->startOfMonth())->count();
        $sedangDiservis = InventoryItem::where('item_condition', 'perlu_perawatan')->count();
        $perluDiganti = InventoryItem::where('item_condition', 'rusak')->count();

        $itemsQuery = InventoryItem::with('category');

        if ($search) {
            $itemsQuery->where(function ($q) use ($search) {
                $q->where('item_name', 'like', "%{$search}%")
                    ->orWhere('item_code', 'like', "%{$search}%");
            });
        }

        $recentItems = $itemsQuery
            ->latest()
            ->take(5)
            ->get()
            ->map(fn (InventoryItem $item) => [
                'itemName' => $item->item_name,
                'categoryName' => $item->category?->category_name ?? '-',
                'itemCondition' => $item->item_condition,
                'locationName' => $item->location_name,
                'updated' => $item->updated_at->diffForHumans(),
            ]);

        return Inertia::render('admin/Dashboard', [
            'stats' => [
                ['title' => 'Total Inventaris', 'value' => (string) $total, 'subtitle' => 'Item baru '.$barangBaru],
                ['title' => 'Kondisi Bagus', 'value' => $total > 0 ? round(($baik / $total) * 100).'%' : '0%', 'subtitle' => $baik.'/'.$total.' item baik'],
                ['title' => 'Perlu Perawatan', 'value' => (string) $perluPerawatan, 'subtitle' => 'Perlu tindakan'],
                ['title' => 'Rusak Tidak Layak', 'value' => (string) $rusak, 'subtitle' => 'Segera diganti'],
            ],
            'categories' => $categories,
            'activities' => $activities,
            'maintenance' => $maintenance,
            'quickSummary' => [
                'aktif' => $aktif,
                'barangBaru' => $barangBaru,
                'sedangDiservis' => $sedangDiservis,
                'perluDiganti' => $perluDiganti,
            ],
            'recentItems' => $recentItems,
        ]);
    }
}
