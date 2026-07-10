<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreRegistrationPaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'memberId' => 'required|exists:members,id',
            'packageId' => 'required|exists:membership_packages,id',
            'durationMonths' => 'required|integer|min:1',
            'startDate' => 'required|date',
            'registrationDate' => 'required|date',
            'registrationFee' => 'required|numeric|min:0',
            'amount' => 'required|numeric|min:0',
            'adminFee' => 'nullable|numeric|min:0',
            'paymentMethod' => 'required|string|max:20',
            'paymentStatus' => 'required|string|max:20|in:paid,unpaid',
            'notes' => 'nullable|string|max:1000',
        ];
    }
}
