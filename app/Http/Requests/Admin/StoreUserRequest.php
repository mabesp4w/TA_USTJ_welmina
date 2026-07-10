<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $userId = $this->route('user')?->getKey();

        return [
            'fullName' => 'required|string|max:100',
            'username' => [
                'required',
                'string',
                'max:50',
                $userId
                    ? Rule::unique('users', 'username')->ignore($userId)
                    : 'unique:users,username',
            ],
            'email' => [
                'nullable',
                'email',
                'max:100',
                $userId
                    ? Rule::unique('users', 'email')->ignore($userId)
                    : 'unique:users,email',
            ],
            'password' => $userId ? 'nullable|string|min:5' : 'required|string|min:5',
            'role' => 'required|string|in:administrator,pengelola,pimpinan',
            'isActive' => 'boolean',
        ];
    }

    public function attributes(): array
    {
        return [
            'fullName' => 'Nama Lengkap',
            'username' => 'Username',
            'email' => 'Email',
            'password' => 'Password',
            'role' => 'Role',
            'isActive' => 'Status Aktif',
        ];
    }
}
