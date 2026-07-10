<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $categoryId = $this->route('gymEquipment')?->getKey();

        return [
            'categoryName' => [
                'required',
                'string',
                'max:100',
                $categoryId
                    ? "unique:inventory_categories,category_name,{$categoryId}"
                    : 'unique:inventory_categories,category_name',
            ],
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ];
    }

    public function attributes(): array
    {
        return [
            'categoryName' => 'Nama Kategori',
            'description' => 'Deskripsi',
            'image' => 'Gambar',
        ];
    }
}
