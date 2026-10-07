<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class DonorRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        $donorId = $this->route('donor')?->id;

        return [
            'name' => [
                'required',
                'string',
                'max:100',
            ],

            'email' => [
                'nullable',
                'email',
                'max:100',
                Rule::unique('donors', 'email')->ignore($donorId),
            ],

            'age' => [
                'nullable',
                'integer',
                'min:1',
            ],

            'sex' => [
                'nullable',
                'string',
                'max:10',
            ],

            'blood_group' => [
                'required',
                Rule::in([
                    'A+',
                    'A-',
                    'B+',
                    'B-',
                    'AB+',
                    'AB-',
                    'O+',
                    'O-',
                ]),
            ],

            'contact_number' => [
                'required',
                'string',
                'max:15',
            ],

            'address' => [
                'nullable',
                'string',
            ],

            'last_donation_date' => [
                'nullable',
                'date',
                'before_or_equal:today',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'blood_group.in' => 'Please select a valid blood group.',
            'email.unique' => 'This email is already assigned to another donor.',
            'last_donation_date.before_or_equal' =>
                'The last donation date cannot be in the future.',
        ];
    }
}