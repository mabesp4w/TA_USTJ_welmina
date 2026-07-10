<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreInventoryRequest;
use App\Models\InventoryCategory;
use App\Models\InventoryItem;
use App\Models\Supplier;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
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
        InventoryItem::create([
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
        ]);

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
            'notes' => $inventory->notes,
        ]);
    }

    public function update(StoreInventoryRequest $request, InventoryItem $inventory): RedirectResponse
    {
        $inventory->update([
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
        ]);

        return redirect()->route('admin.inventory')->with('success', 'Data inventaris berhasil diperbarui!');
    }

    public function destroy(InventoryItem $inventory): RedirectResponse
    {
        $inventory->delete();

        return redirect()->route('admin.inventory')->with('success', 'Data inventaris berhasil dihapus!');
    }
}
