<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreCategoryRequest;
use App\Models\InventoryCategory;
use App\Services\ActivityLogService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Response;

class GymEquipmentController extends Controller
{
    public function index(Request $request): Response
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
                'image' => $c->image ? Storage::url($c->image) : null,
                'itemCount' => $c->items()->count(),
            ]);

        $stats = [
            'total' => InventoryCategory::count(),
            'withItems' => InventoryCategory::whereHas('items')->count(),
            'empty' => InventoryCategory::whereDoesntHave('items')->count(),
        ];

        return $this->inertia('admin/GymEquipment', [
            'categories' => $categories,
            'stats' => $stats,
        ]);
    }

    public function store(StoreCategoryRequest $request): RedirectResponse
    {
        $data = [
            'category_name' => $request->input('categoryName'),
            'description' => $request->input('description'),
        ];

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('categories', 'public');
        }

        $category = InventoryCategory::create($data);

        ActivityLogService::log(
            activityType: 'tambah',
            activityName: 'Tambah Kategori: '.$category->category_name,
            description: 'Menambahkan kategori peralatan baru "'.$category->category_name.'"',
            referenceTable: 'inventory_categories',
            referenceId: $category->id,
        );

        return redirect()->route('admin.gym-equipment')->with('success', 'Kategori peralatan gym berhasil disimpan!');
    }

    public function show(InventoryCategory $gymEquipment): JsonResponse
    {
        return response()->json([
            'id' => $gymEquipment->id,
            'categoryName' => $gymEquipment->category_name,
            'description' => $gymEquipment->description,
            'image' => $gymEquipment->image ? Storage::url($gymEquipment->image) : null,
            'imagePath' => $gymEquipment->image,
        ]);
    }

    public function update(StoreCategoryRequest $request, InventoryCategory $gymEquipment): RedirectResponse
    {
        $data = [
            'category_name' => $request->input('categoryName'),
            'description' => $request->input('description'),
        ];

        if ($request->hasFile('image')) {
            if ($gymEquipment->image) {
                Storage::disk('public')->delete($gymEquipment->image);
            }

            $data['image'] = $request->file('image')->store('categories', 'public');
        }

        $gymEquipment->update($data);

        ActivityLogService::log(
            activityType: 'tambah',
            activityName: 'Update Kategori: '.$gymEquipment->category_name,
            description: 'Memperbarui kategori peralatan "'.$gymEquipment->category_name.'"',
            referenceTable: 'inventory_categories',
            referenceId: $gymEquipment->id,
        );

        return redirect()->route('admin.gym-equipment')->with('success', 'Kategori peralatan gym berhasil diperbarui!');
    }

    public function destroy(InventoryCategory $gymEquipment): RedirectResponse
    {
        ActivityLogService::log(
            activityType: 'lainnya',
            activityName: 'Hapus Kategori: '.$gymEquipment->category_name,
            description: 'Menghapus kategori peralatan "'.$gymEquipment->category_name.'"',
            referenceTable: 'inventory_categories',
            referenceId: $gymEquipment->id,
        );

        if ($gymEquipment->image) {
            Storage::disk('public')->delete($gymEquipment->image);
        }

        $gymEquipment->delete();

        return redirect()->route('admin.gym-equipment')->with('success', 'Kategori peralatan gym berhasil dihapus!');
    }
}
