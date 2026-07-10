<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreSupplierRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $supplierId = $this->route('supplier')?->getKey();

        return [
            'supplierName' => [
                'required',
                'string',
                'max:100',
                $supplierId
                    ? "unique:suppliers,supplier_name,{$supplierId}"
                    : 'unique:suppliers,supplier_name',
            ],
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:100',
            'address' => 'nullable|string',
            'notes' => 'nullable|string',
        ];
    }

    public function attributes(): array
    {
        return [
            'supplierName' => 'Nama Pemasok',
            'phone' => 'Telepon',
            'email' => 'Email',
            'address' => 'Alamat',
            'notes' => 'Catatan',
        ];
    }
}
