<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreProcurementRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $itemId = $this->route('procurement')?->getKey();

        return [
            'procurementCode' => [
                'required',
                'string',
                'max:30',
                $itemId
                    ? "unique:procurements,procurement_code,{$itemId}"
                    : 'unique:procurements,procurement_code',
            ],
            'itemId' => 'required|exists:inventory_items,id',
            'supplierId' => 'required|exists:suppliers,id',
            'quantity' => 'required|integer|min:1',
            'unitPrice' => 'required|numeric|min:0',
            'procurementDate' => 'required|date',
            'notes' => 'nullable|string',
        ];
    }

    public function attributes(): array
    {
        return [
            'procurementCode' => 'Kode Pengadaan',
            'itemId' => 'Barang',
            'supplierId' => 'Pemasok',
            'quantity' => 'Jumlah',
            'unitPrice' => 'Harga Satuan',
            'procurementDate' => 'Tanggal Pengadaan',
            'notes' => 'Catatan',
        ];
    }
}
