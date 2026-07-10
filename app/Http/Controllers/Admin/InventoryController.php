<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreInventoryRequest;
use App\Models\InventoryCategory;
use App\Models\InventoryItem;
use App\Models\Supplier;
use App\Services\ActivityLogService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Response;

class InventoryController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->query('search');
        $condition = $request->query('condition');
        $status = $request->query('status');

        $query = InventoryItem::with('category', 'supplier');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('item_name', 'like', "%{$search}%")
                    ->orWhere('item_code', 'like', "%{$search}%");
            });
        }

        if ($condition) {
            $query->where('item_condition', $condition);
        }

        if ($status) {
            $query->where('item_status', $status);
        }

        $items = $query
            ->orderBy('item_name')
            ->get()
            ->map(fn (InventoryItem $i) => [
                'id' => $i->id,
                'itemCode' => $i->item_code,
                'itemName' => $i->item_name,
                'categoryName' => $i->category?->category_name ?? '-',
                'stock' => $i->stock,
                'itemCondition' => $i->item_condition,
                'itemStatus' => $i->item_status,
                'locationName' => $i->location_name,
                'supplierName' => $i->supplier?->supplier_name ?? '-',
                'imagePath' => $i->image_path ? Storage::url($i->image_path) : null,
            ]);

        $stats = [
            'total' => InventoryItem::count(),
            'baik' => InventoryItem::where('item_condition', 'baik')->count(),
            'perluPerawatan' => InventoryItem::where('item_condition', 'perlu_perawatan')->count(),
            'rusak' => InventoryItem::where('item_condition', 'rusak')->count(),
        ];

        $categories = InventoryCategory::orderBy('category_name')
            ->get()
            ->map(fn (InventoryCategory $c) => [
                'id' => $c->id,
                'categoryName' => $c->category_name,
            ]);

        $suppliers = Supplier::orderBy('supplier_name')
            ->get()
            ->map(fn (Supplier $s) => [
                'id' => $s->id,
                'supplierName' => $s->supplier_name,
            ]);

        return $this->inertia('admin/Inventory', [
            'items' => $items,
            'stats' => $stats,
            'categories' => $categories,
            'suppliers' => $suppliers,
        ]);
    }

    public function store(StoreInventoryRequest $request): RedirectResponse
    {
        $data = [
            'item_code' => $request->input('itemCode'),
            'item_name' => $request->input('itemName'),
            'category_id' => $request->input('categoryId'),
            'stock' => $request->input('stock', 0),
            'item_condition' => $request->input('itemCondition', 'baik'),
            'item_status' => $request->input('itemStatus', 'aktif'),
            'location_name' => $request->input('locationName'),
            'supplier_id' => $request->input('supplierId'),
            'last_service_date' => $request->input('lastServiceDate'),
            'notes' => $request->input('notes'),
        ];

        if ($request->hasFile('image')) {
            $data['image_path'] = $request->file('image')->store('inventory-items', 'public');
        }

        $item = InventoryItem::create($data);

        ActivityLogService::log(
            activityType: 'tambah',
            activityName: 'Tambah Barang: '.$item->item_name,
            description: 'Menambahkan barang inventaris "'.$item->item_name.'" ('.$item->item_code.') dengan stok '.$item->stock,
            inventoryItemId: $item->id,
            referenceTable: 'inventory_items',
            referenceId: $item->id,
        );

        return redirect()->route('admin.inventory')->with('success', 'Data inventaris berhasil disimpan!');
    }

    public function show(InventoryItem $inventory): JsonResponse
    {
        $inventory->load('category', 'supplier');

        return response()->json([
            'id' => $inventory->id,
            'itemCode' => $inventory->item_code,
            'itemName' => $inventory->item_name,
            'categoryId' => $inventory->category_id,
            'categoryName' => $inventory->category?->category_name ?? '-',
            'stock' => $inventory->stock,
            'itemCondition' => $inventory->item_condition,
            'itemStatus' => $inventory->item_status,
            'locationName' => $inventory->location_name,
            'supplierId' => $inventory->supplier_id,
            'supplierName' => $inventory->supplier?->supplier_name ?? '-',
            'lastServiceDate' => $inventory->last_service_date?->toDateString(),
            'imagePath' => $inventory->image_path ? Storage::url($inventory->image_path) : null,
            'notes' => $inventory->notes,
        ]);
    }

    public function update(StoreInventoryRequest $request, InventoryItem $inventory): RedirectResponse
    {
        $data = [
            'item_code' => $request->input('itemCode'),
            'item_name' => $request->input('itemName'),
            'category_id' => $request->input('categoryId'),
            'stock' => $request->input('stock', 0),
            'item_condition' => $request->input('itemCondition', 'baik'),
            'item_status' => $request->input('itemStatus', 'aktif'),
            'location_name' => $request->input('locationName'),
            'supplier_id' => $request->input('supplierId'),
            'last_service_date' => $request->input('lastServiceDate'),
            'notes' => $request->input('notes'),
        ];

        if ($request->hasFile('image')) {
            if ($inventory->image_path) {
                Storage::disk('public')->delete($inventory->image_path);
            }
            $data['image_path'] = $request->file('image')->store('inventory-items', 'public');
        }

        $inventory->update($data);

        ActivityLogService::log(
            activityType: 'tambah',
            activityName: 'Update Barang: '.$inventory->item_name,
            description: 'Memperbarui data barang inventaris "'.$inventory->item_name.'" ('.$inventory->item_code.')',
            inventoryItemId: $inventory->id,
            referenceTable: 'inventory_items',
            referenceId: $inventory->id,
        );

        return redirect()->route('admin.inventory')->with('success', 'Data inventaris berhasil diperbarui!');
    }

    public function destroy(InventoryItem $inventory): RedirectResponse
    {
        ActivityLogService::log(
            activityType: 'lainnya',
            activityName: 'Hapus Barang: '.$inventory->item_name,
            description: 'Menghapus barang inventaris "'.$inventory->item_name.'" ('.$inventory->item_code.')',
            inventoryItemId: $inventory->id,
            referenceTable: 'inventory_items',
            referenceId: $inventory->id,
        );

        $inventory->delete();

        return redirect()->route('admin.inventory')->with('success', 'Data inventaris berhasil dihapus!');
    }
}
