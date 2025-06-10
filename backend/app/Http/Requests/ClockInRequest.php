<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ClockInRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'address' => 'required|string|max:500',
            'supporting_evidence' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048'
        ];
    }

    public function messages(): array
    {
        return [
            'latitude.required' => 'Latitude is required',
            'latitude.between' => 'Latitude must be between -90 and 90',
            'longitude.required' => 'Longitude is required',
            'longitude.between' => 'Longitude must be between -180 and 180',
            'address.required' => 'Address is required',
            'address.max' => 'Address cannot exceed 500 characters',
            'supporting_evidence.mimes' => 'Supporting evidence must be jpg, jpeg, png, or pdf',
            'supporting_evidence.max' => 'Supporting evidence cannot exceed 2MB'
        ];
    }
}