<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreMemberRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'fullName' => ['required', 'string', 'max:100'],
            'identityNo' => ['required', 'string', 'size:16', 'unique:members,identity_no'],
            'phone' => ['required', 'string', 'max:20'],
            'birthDate' => ['required', 'date'],
            'gender' => ['required', 'string', 'size:1'],
            'email' => ['nullable', 'email', 'max:100'],
            'address' => ['required', 'string'],
        ];
    }
}
