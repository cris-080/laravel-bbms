<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class BloodRequestFormRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'physician_name' => [
                'required',
                'string',
                'max:255',
            ],

            'patient_name' => [
                'required',
                'string',
                'max:100',
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

            'units_needed' => [
                'required',
                'integer',
                'min:1',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'blood_group.in' => 'Please select a valid blood group.',
            'units_needed.min' => 'At least one unit of blood must be requested.',
        ];
    }
}