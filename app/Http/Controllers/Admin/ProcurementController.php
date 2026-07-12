<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreProcurementRequest;
use App\Models\InventoryItem;
use App\Models\Procurement;
use App\Models\Supplier;
use App\Services\ActivityLogService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProcurementController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->query('search');

        $query = Procurement::with('item', 'supplier');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('procurement_code', 'like', "%{$search}%")
                    ->orWhereHas('item', fn ($iq) => $iq->where('item_name', 'like', "%{$search}%"))
                    ->orWhereHas('supplier', fn ($sq) => $sq->where('supplier_name', 'like', "%{$search}%"));
            });
        }

        $procurements = $query
            ->orderByDesc('procurement_date')
            ->paginate(10)
            ->through(fn (Procurement $p) => [
                'id' => $p->id,
                'procurementCode' => $p->procurement_code,
                'itemName' => $p->item?->item_name ?? '-',
                'supplierName' => $p->supplier?->supplier_name ?? '-',
                'quantity' => $p->quantity,
                'unitPrice' => (int) $p->unit_price,
                'totalPrice' => (int) $p->total_price,
                'procurementDate' => $p->procurement_date?->toDateString(),
            ]);

        $stats = [
            'total' => Procurement::count(),
            'totalQuantity' => Procurement::sum('quantity'),
            'totalSpending' => (int) Procurement::sum('total_price'),
        ];

        $items = InventoryItem::orderBy('item_name')
            ->get()
            ->map(fn (InventoryItem $i) => [
                'id' => $i->id,
                'itemName' => $i->item_name,
            ]);

        $suppliers = Supplier::orderBy('supplier_name')
            ->get()
            ->map(fn (Supplier $s) => [
                'id' => $s->id,
                'supplierName' => $s->supplier_name,
            ]);

        return Inertia::render('admin/Procurement', [
            'procurements' => $procurements,
            'stats' => $stats,
            'items' => $items,
            'suppliers' => $suppliers,
        ]);
    }

    public function store(StoreProcurementRequest $request): RedirectResponse
    {
        $unitPrice = (int) $request->input('unitPrice');
        $quantity = (int) $request->input('quantity');
        $totalPrice = $unitPrice * $quantity;

        $procurement = Procurement::create([
            'procurement_code' => $request->input('procurementCode'),
            'item_id' => $request->input('itemId'),
            'supplier_id' => $request->input('supplierId'),
            'quantity' => $quantity,
            'unit_price' => $unitPrice,
            'total_price' => $totalPrice,
            'procurement_date' => $request->input('procurementDate'),
            'notes' => $request->input('notes'),
        ]);

        $itemName = $procurement->item?->item_name ?? 'Unknown';

        ActivityLogService::log(
            activityType: 'pengadaan',
            activityName: 'Tambah Pengadaan: '.$itemName,
            description: 'Menambahkan pengadaan "'.$itemName.'" ('.$procurement->procurement_code.') sebanyak '.$quantity.' unit',
            inventoryItemId: $procurement->item_id,
            referenceTable: 'procurements',
            referenceId: $procurement->id,
        );

        return redirect()->route('admin.procurement')->with('success', 'Data pengadaan berhasil disimpan!');
    }

    public function show(Procurement $procurement): JsonResponse
    {
        $procurement->load('item', 'supplier');

        return response()->json([
            'id' => $procurement->id,
            'procurementCode' => $procurement->procurement_code,
            'itemId' => $procurement->item_id,
            'itemName' => $procurement->item?->item_name ?? '-',
            'supplierId' => $procurement->supplier_id,
            'supplierName' => $procurement->supplier?->supplier_name ?? '-',
            'quantity' => $procurement->quantity,
            'unitPrice' => (int) $procurement->unit_price,
            'totalPrice' => (int) $procurement->total_price,
            'procurementDate' => $procurement->procurement_date?->toDateString(),
            'notes' => $procurement->notes,
        ]);
    }

    public function update(StoreProcurementRequest $request, Procurement $procurement): RedirectResponse
    {
        $unitPrice = (int) $request->input('unitPrice');
        $quantity = (int) $request->input('quantity');
        $totalPrice = $unitPrice * $quantity;

        $procurement->update([
            'procurement_code' => $request->input('procurementCode'),
            'item_id' => $request->input('itemId'),
            'supplier_id' => $request->input('supplierId'),
            'quantity' => $quantity,
            'unit_price' => $unitPrice,
            'total_price' => $totalPrice,
            'procurement_date' => $request->input('procurementDate'),
            'notes' => $request->input('notes'),
        ]);

        $itemName = $procurement->item?->item_name ?? 'Unknown';

        ActivityLogService::log(
            activityType: 'pengadaan',
            activityName: 'Update Pengadaan: '.$itemName,
            description: 'Memperbarui data pengadaan "'.$itemName.'" ('.$procurement->procurement_code.')',
            inventoryItemId: $procurement->item_id,
            referenceTable: 'procurements',
            referenceId: $procurement->id,
        );

        return redirect()->route('admin.procurement')->with('success', 'Data pengadaan berhasil diperbarui!');
    }

    public function destroy(Procurement $procurement): RedirectResponse
    {
        $itemName = $procurement->item?->item_name ?? 'Unknown';

        ActivityLogService::log(
            activityType: 'lainnya',
            activityName: 'Hapus Pengadaan: '.$itemName,
            description: 'Menghapus data pengadaan "'.$itemName.'" ('.$procurement->procurement_code.')',
            inventoryItemId: $procurement->item_id,
            referenceTable: 'procurements',
            referenceId: $procurement->id,
        );

        $procurement->delete();

        return redirect()->route('admin.procurement')->with('success', 'Data pengadaan berhasil dihapus!');
    }
}
