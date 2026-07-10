<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreMaintenanceLogRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'inventoryItemId' => 'required|exists:inventory_items,id',
            'maintenanceType' => 'required|string|max:20|in:perbaikan,perawatan,pemeriksaan',
            'maintenanceDate' => 'required|date',
            'cost' => 'required|numeric|min:0',
            'resultCondition' => 'required|string|max:20|in:baik,perlu_perawatan,rusak',
            'performedBy' => 'required|string|max:100',
            'notes' => 'nullable|string',
        ];
    }

    public function attributes(): array
    {
        return [
            'inventoryItemId' => 'Barang Inventaris',
            'maintenanceType' => 'Jenis Perawatan',
            'maintenanceDate' => 'Tanggal Perawatan',
            'cost' => 'Biaya',
            'resultCondition' => 'Hasil Kondisi',
            'performedBy' => 'Pelaksana',
            'notes' => 'Catatan',
        ];
    }
}
