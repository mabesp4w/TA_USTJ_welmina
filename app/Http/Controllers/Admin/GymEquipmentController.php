<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreCategoryRequest;
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

class GymEquipmentController extends Controller
{
    // ======================================================
    // Item methods (fitness inventory) — admin/gym-equipment
    // ======================================================

    public function index(Request $request): Response
    {
        $search = $request->query('search');
        $condition = $request->query('condition');
        $status = $request->query('status');

        $query = InventoryItem::with('category', 'supplier')
            ->whereHas('category', fn ($q) => $q->where('is_fitness_tools', true));

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

        $fitnessCategoryIds = InventoryCategory::where('is_fitness_tools', true)->pluck('id');

        $stats = [
            'total' => InventoryItem::whereIn('category_id', $fitnessCategoryIds)->count(),
            'baik' => InventoryItem::whereIn('category_id', $fitnessCategoryIds)->where('item_condition', 'baik')->count(),
            'perluPerawatan' => InventoryItem::whereIn('category_id', $fitnessCategoryIds)->where('item_condition', 'perlu_perawatan')->count(),
            'rusak' => InventoryItem::whereIn('category_id', $fitnessCategoryIds)->where('item_condition', 'rusak')->count(),
        ];

        $categories = InventoryCategory::where('is_fitness_tools', true)
            ->orderBy('category_name')
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

        return $this->inertia('admin/GymEquipment', [
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
            activityName: 'Tambah Peralatan: '.$item->item_name,
            description: 'Menambahkan peralatan fitness "'.$item->item_name.'" ('.$item->item_code.') dengan stok '.$item->stock,
            inventoryItemId: $item->id,
            referenceTable: 'inventory_items',
            referenceId: $item->id,
        );

        return redirect()->route('admin.gym-equipment')->with('success', 'Peralatan fitness berhasil disimpan!');
    }

    public function show(InventoryItem $gymEquipment): JsonResponse
    {
        $gymEquipment->load('category', 'supplier');

        return response()->json([
            'id' => $gymEquipment->id,
            'itemCode' => $gymEquipment->item_code,
            'itemName' => $gymEquipment->item_name,
            'categoryId' => $gymEquipment->category_id,
            'categoryName' => $gymEquipment->category?->category_name ?? '-',
            'stock' => $gymEquipment->stock,
            'itemCondition' => $gymEquipment->item_condition,
            'itemStatus' => $gymEquipment->item_status,
            'locationName' => $gymEquipment->location_name,
            'supplierId' => $gymEquipment->supplier_id,
            'supplierName' => $gymEquipment->supplier?->supplier_name ?? '-',
            'lastServiceDate' => $gymEquipment->last_service_date?->toDateString(),
            'imagePath' => $gymEquipment->image_path ? Storage::url($gymEquipment->image_path) : null,
            'notes' => $gymEquipment->notes,
        ]);
    }

    public function update(StoreInventoryRequest $request, InventoryItem $gymEquipment): RedirectResponse
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
            if ($gymEquipment->image_path) {
                Storage::disk('public')->delete($gymEquipment->image_path);
            }
            $data['image_path'] = $request->file('image')->store('inventory-items', 'public');
        }

        $gymEquipment->update($data);

        ActivityLogService::log(
            activityType: 'tambah',
            activityName: 'Update Peralatan: '.$gymEquipment->item_name,
            description: 'Memperbarui peralatan fitness "'.$gymEquipment->item_name.'" ('.$gymEquipment->item_code.')',
            inventoryItemId: $gymEquipment->id,
            referenceTable: 'inventory_items',
            referenceId: $gymEquipment->id,
        );

        return redirect()->route('admin.gym-equipment')->with('success', 'Peralatan fitness berhasil diperbarui!');
    }

    public function destroy(InventoryItem $gymEquipment): RedirectResponse
    {
        ActivityLogService::log(
            activityType: 'lainnya',
            activityName: 'Hapus Peralatan: '.$gymEquipment->item_name,
            description: 'Menghapus peralatan fitness "'.$gymEquipment->item_name.'" ('.$gymEquipment->item_code.')',
            inventoryItemId: $gymEquipment->id,
            referenceTable: 'inventory_items',
            referenceId: $gymEquipment->id,
        );

        $gymEquipment->delete();

        return redirect()->route('admin.gym-equipment')->with('success', 'Peralatan fitness berhasil dihapus!');
    }

    // ======================================================
    // Category methods — admin/category
    // ======================================================

    public function category(Request $request): Response
    {
        return $this->renderCategories($request, 'admin/Category');
    }

    public function categoryStore(StoreCategoryRequest $request): RedirectResponse
    {
        $category = InventoryCategory::create([
            'category_name' => $request->input('categoryName'),
            'description' => $request->input('description'),
            'is_fitness_tools' => $request->boolean('isFitnessTools'),
        ]);

        ActivityLogService::log(
            activityType: 'tambah',
            activityName: 'Tambah Kategori: '.$category->category_name,
            description: 'Menambahkan kategori baru "'.$category->category_name.'"',
            referenceTable: 'inventory_categories',
            referenceId: $category->id,
        );

        return redirect()->route('admin.category')->with('success', 'Kategori berhasil disimpan!');
    }

    public function categoryShow(InventoryCategory $category): JsonResponse
    {
        return response()->json([
            'id' => $category->id,
            'categoryName' => $category->category_name,
            'description' => $category->description,
            'isFitnessTools' => $category->is_fitness_tools,
        ]);
    }

    public function categoryUpdate(StoreCategoryRequest $request, InventoryCategory $category): RedirectResponse
    {
        $category->update([
            'category_name' => $request->input('categoryName'),
            'description' => $request->input('description'),
            'is_fitness_tools' => $request->boolean('isFitnessTools'),
        ]);

        ActivityLogService::log(
            activityType: 'tambah',
            activityName: 'Update Kategori: '.$category->category_name,
            description: 'Memperbarui kategori "'.$category->category_name.'"',
            referenceTable: 'inventory_categories',
            referenceId: $category->id,
        );

        return redirect()->route('admin.category')->with('success', 'Kategori berhasil diperbarui!');
    }

    public function categoryDestroy(InventoryCategory $category): RedirectResponse
    {
        ActivityLogService::log(
            activityType: 'lainnya',
            activityName: 'Hapus Kategori: '.$category->category_name,
            description: 'Menghapus kategori "'.$category->category_name.'"',
            referenceTable: 'inventory_categories',
            referenceId: $category->id,
        );

        $category->delete();

        return redirect()->route('admin.category')->with('success', 'Kategori berhasil dihapus!');
    }

    // ======================================================
    // Shared
    // ======================================================

    private function renderCategories(Request $request, string $view): Response
    {
        $search = $request->query('search');

        $query = InventoryCategory::query();

        if ($search) {
            $query->where('category_name', 'like', "%{$search}%");
        }

        $categories = $query
            ->orderBy('category_name')
            ->get()
            ->map(fn (InventoryCategory $c) => [
                'id' => $c->id,
                'categoryName' => $c->category_name,
                'description' => $c->description,
                'isFitnessTools' => $c->is_fitness_tools,
                'itemCount' => $c->items()->count(),
            ]);

        $stats = [
            'total' => InventoryCategory::count(),
            'withItems' => InventoryCategory::whereHas('items')->count(),
            'empty' => InventoryCategory::whereDoesntHave('items')->count(),
        ];

        return $this->inertia($view, [
            'categories' => $categories,
            'stats' => $stats,
        ]);
    }
}
