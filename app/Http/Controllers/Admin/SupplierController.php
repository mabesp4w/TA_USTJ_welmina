<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreSupplierRequest;
use App\Models\Supplier;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SupplierController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->query('search');

        $query = Supplier::query();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('supplier_name', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $suppliers = $query
            ->orderBy('supplier_name')
            ->get()
            ->map(fn (Supplier $s) => [
                'id' => $s->id,
                'supplierName' => $s->supplier_name,
                'phone' => $s->phone,
                'email' => $s->email,
                'address' => $s->address,
                'notes' => $s->notes,
                'itemCount' => $s->items()->count(),
            ]);

        $stats = [
            'total' => Supplier::count(),
            'withItems' => Supplier::whereHas('items')->count(),
        ];

        return Inertia::render('admin/Supplier', [
            'suppliers' => $suppliers,
            'stats' => $stats,
        ]);
    }

    public function store(StoreSupplierRequest $request): RedirectResponse
    {
        Supplier::create([
            'supplier_name' => $request->input('supplierName'),
            'phone' => $request->input('phone'),
            'email' => $request->input('email'),
            'address' => $request->input('address'),
            'notes' => $request->input('notes'),
        ]);

        return redirect()->route('admin.supplier')->with('success', 'Data pemasok berhasil disimpan!');
    }

    public function show(Supplier $supplier): JsonResponse
    {
        return response()->json([
            'id' => $supplier->id,
            'supplierName' => $supplier->supplier_name,
            'phone' => $supplier->phone,
            'email' => $supplier->email,
            'address' => $supplier->address,
            'notes' => $supplier->notes,
        ]);
    }

    public function update(StoreSupplierRequest $request, Supplier $supplier): RedirectResponse
    {
        $supplier->update([
            'supplier_name' => $request->input('supplierName'),
            'phone' => $request->input('phone'),
            'email' => $request->input('email'),
            'address' => $request->input('address'),
            'notes' => $request->input('notes'),
        ]);

        return redirect()->route('admin.supplier')->with('success', 'Data pemasok berhasil diperbarui!');
    }

    public function destroy(Supplier $supplier): RedirectResponse
    {
        $supplier->delete();

        return redirect()->route('admin.supplier')->with('success', 'Data pemasok berhasil dihapus!');
    }
}
