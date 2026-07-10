<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreInventoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $itemId = $this->route('inventory')?->getKey();

        return [
            'itemCode' => [
                'required',
                'string',
                'max:30',
                $itemId
                    ? "unique:inventory_items,item_code,{$itemId}"
                    : 'unique:inventory_items,item_code',
            ],
            'itemName' => 'required|string|max:100',
            'categoryId' => 'required|exists:inventory_categories,id',
            'stock' => 'required|integer|min:0',
            'itemCondition' => 'required|string|in:baik,perlu_perawatan,rusak',
            'itemStatus' => 'required|string|in:aktif,tidak_aktif',
            'locationName' => 'nullable|string|max:100',
            'supplierId' => 'nullable|exists:suppliers,id',
            'lastServiceDate' => 'nullable|date',
            'notes' => 'nullable|string',
        ];
    }

    public function attributes(): array
    {
        return [
            'itemCode' => 'Kode Barang',
            'itemName' => 'Nama Barang',
            'categoryId' => 'Kategori',
            'stock' => 'Stok',
            'itemCondition' => 'Kondisi',
            'itemStatus' => 'Status',
            'locationName' => 'Lokasi',
            'supplierId' => 'Supplier',
            'lastServiceDate' => 'Tgl. Service Terakhir',
            'notes' => 'Catatan',
        ];
    }
}
