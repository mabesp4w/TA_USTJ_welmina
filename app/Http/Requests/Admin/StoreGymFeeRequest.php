<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreGymFeeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $packageId = $this->route('gymFee')?->getKey();

        return [
            'packageName' => [
                'required',
                'string',
                'max:50',
                $packageId
                    ? "unique:membership_packages,package_name,{$packageId}"
                    : 'unique:membership_packages,package_name',
            ],
            'registrationFee' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'isActive' => 'boolean',
            'prices' => 'required|array|min:1',
            'prices.*.durationMonths' => 'required|integer|min:1',
            'prices.*.price' => 'required|numeric|min:0',
        ];
    }

    public function attributes(): array
    {
        return [
            'packageName' => 'Nama Paket',
            'registrationFee' => 'Biaya Pendaftaran',
            'description' => 'Deskripsi',
            'isActive' => 'Status Aktif',
            'prices' => 'Harga per Durasi',
            'prices.*.durationMonths' => 'Durasi',
            'prices.*.price' => 'Harga',
        ];
    }
}
