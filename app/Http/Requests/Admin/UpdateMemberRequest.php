<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateMemberRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $memberId = $this->route('member');

        return [
            'fullName' => ['required', 'string', 'max:100'],
            'identityNo' => ['nullable', 'string', 'size:16', Rule::unique('members', 'identity_no')->ignore($memberId)],
            'phone' => ['nullable', 'string', 'max:20'],
            'birthDate' => ['nullable', 'date'],
            'gender' => ['nullable', 'string', 'size:1'],
            'email' => ['nullable', 'email', 'max:100'],
            'address' => ['nullable', 'string'],
            'memberStatus' => ['nullable', 'string', 'in:active,inactive'],
        ];
    }
}
