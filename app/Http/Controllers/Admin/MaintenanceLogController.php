<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreMaintenanceLogRequest;
use App\Models\InventoryItem;
use App\Models\MaintenanceLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Response;

class MaintenanceLogController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->query('search');

        $query = MaintenanceLog::with('inventoryItem');

        if ($search) {
            $query->whereHas('inventoryItem', function ($q) use ($search) {
                $q->where('item_name', 'like', "%{$search}%");
            })->orWhere('performed_by', 'like', "%{$search}%");
        }

        $logs = $query
            ->orderBy('maintenance_date', 'desc')
            ->get()
            ->map(fn (MaintenanceLog $log) => [
                'id' => $log->id,
                'inventoryItemId' => $log->inventory_item_id,
                'itemName' => $log->inventoryItem?->item_name ?? '-',
                'maintenanceType' => $log->maintenance_type,
                'maintenanceDate' => $log->maintenance_date->toDateString(),
                'cost' => (int) $log->cost,
                'resultCondition' => $log->result_condition,
                'performedBy' => $log->performed_by,
            ]);

        $stats = [
            'total' => MaintenanceLog::count(),
            'totalCost' => (int) MaintenanceLog::sum('cost'),
            'perbaikan' => MaintenanceLog::where('maintenance_type', 'perbaikan')->count(),
            'perawatan' => MaintenanceLog::where('maintenance_type', 'perawatan')->count(),
        ];

        $inventoryItems = InventoryItem::orderBy('item_name')
            ->get()
            ->map(fn (InventoryItem $i) => [
                'id' => $i->id,
                'itemName' => $i->item_name,
            ]);

        return $this->inertia('admin/MaintenanceLog', [
            'logs' => $logs,
            'stats' => $stats,
            'inventoryItems' => $inventoryItems,
        ]);
    }

    public function store(StoreMaintenanceLogRequest $request): RedirectResponse
    {
        MaintenanceLog::create([
            'inventory_item_id' => $request->input('inventoryItemId'),
            'maintenance_type' => $request->input('maintenanceType'),
            'maintenance_date' => $request->input('maintenanceDate'),
            'cost' => $request->input('cost', 0),
            'result_condition' => $request->input('resultCondition'),
            'performed_by' => $request->input('performedBy'),
            'notes' => $request->input('notes'),
            'created_by' => $request->user()->id,
        ]);

        return redirect()->route('admin.maintenance-logs')->with('success', 'Data perawatan berhasil disimpan!');
    }

    public function show(MaintenanceLog $maintenanceLog): JsonResponse
    {
        $maintenanceLog->load('inventoryItem');

        return response()->json([
            'id' => $maintenanceLog->id,
            'inventoryItemId' => $maintenanceLog->inventory_item_id,
            'itemName' => $maintenanceLog->inventoryItem?->item_name ?? '-',
            'maintenanceType' => $maintenanceLog->maintenance_type,
            'maintenanceDate' => $maintenanceLog->maintenance_date->toDateString(),
            'cost' => (int) $maintenanceLog->cost,
            'resultCondition' => $maintenanceLog->result_condition,
            'performedBy' => $maintenanceLog->performed_by,
            'notes' => $maintenanceLog->notes,
        ]);
    }

    public function update(StoreMaintenanceLogRequest $request, MaintenanceLog $maintenanceLog): RedirectResponse
    {
        $maintenanceLog->update([
            'inventory_item_id' => $request->input('inventoryItemId'),
            'maintenance_type' => $request->input('maintenanceType'),
            'maintenance_date' => $request->input('maintenanceDate'),
            'cost' => $request->input('cost', 0),
            'result_condition' => $request->input('resultCondition'),
            'performed_by' => $request->input('performedBy'),
            'notes' => $request->input('notes'),
        ]);

        return redirect()->route('admin.maintenance-logs')->with('success', 'Data perawatan berhasil diperbarui!');
    }

    public function destroy(MaintenanceLog $maintenanceLog): RedirectResponse
    {
        $maintenanceLog->delete();

        return redirect()->route('admin.maintenance-logs')->with('success', 'Data perawatan berhasil dihapus!');
    }
}
