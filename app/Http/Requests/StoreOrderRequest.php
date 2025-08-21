<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrderRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'billing_address' => 'required|array',
            'billing_address.first_name' => 'required|string|max:255',
            'billing_address.last_name' => 'required|string|max:255',
            'billing_address.email' => 'required|email|max:255',
            'billing_address.phone' => 'required|string|max:20',
            'billing_address.address_line_1' => 'required|string|max:255',
            'billing_address.address_line_2' => 'nullable|string|max:255',
            'billing_address.city' => 'required|string|max:255',
            'billing_address.state' => 'required|string|max:255',
            'billing_address.postal_code' => 'required|string|max:20',
            'billing_address.country' => 'required|string|max:255',
            
            'shipping_address' => 'nullable|array',
            'shipping_address.first_name' => 'required_with:shipping_address|string|max:255',
            'shipping_address.last_name' => 'required_with:shipping_address|string|max:255',
            'shipping_address.email' => 'required_with:shipping_address|email|max:255',
            'shipping_address.phone' => 'required_with:shipping_address|string|max:20',
            'shipping_address.address_line_1' => 'required_with:shipping_address|string|max:255',
            'shipping_address.address_line_2' => 'nullable|string|max:255',
            'shipping_address.city' => 'required_with:shipping_address|string|max:255',
            'shipping_address.state' => 'required_with:shipping_address|string|max:255',
            'shipping_address.postal_code' => 'required_with:shipping_address|string|max:20',
            'shipping_address.country' => 'required_with:shipping_address|string|max:255',
            
            'payment_method' => 'required|string|in:credit_card,debit_card,paypal',
        ];
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'billing_address.required' => 'Billing address is required.',
            'billing_address.first_name.required' => 'First name is required.',
            'billing_address.last_name.required' => 'Last name is required.',
            'billing_address.email.required' => 'Email address is required.',
            'billing_address.phone.required' => 'Phone number is required.',
            'billing_address.address_line_1.required' => 'Address is required.',
            'billing_address.city.required' => 'City is required.',
            'billing_address.state.required' => 'State is required.',
            'billing_address.postal_code.required' => 'Postal code is required.',
            'billing_address.country.required' => 'Country is required.',
            'payment_method.required' => 'Please select a payment method.',
        ];
    }
}