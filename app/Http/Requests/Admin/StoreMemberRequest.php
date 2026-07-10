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
            'identityNo' => ['nullable', 'string', 'size:16', 'unique:members,identity_no'],
            'phone' => ['nullable', 'string', 'max:20'],
            'birthDate' => ['nullable', 'date'],
            'gender' => ['nullable', 'string', 'size:1'],
            'email' => ['nullable', 'email', 'max:100'],
            'address' => ['nullable', 'string'],
            'packageId' => ['required', 'exists:membership_packages,id'],
            'durationMonths' => ['required', 'integer', 'in:1,3,6'],
            'startDate' => ['required', 'date'],
        ];
    }
}
