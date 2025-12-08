<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;

class UserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $userId = $this->route('user')?->id ?? $this->route('user');

        return [
            'department_id' => [
                'nullable',
                'integer',
                'exists:departments,id',
            ],

            'name' => ['required', 'string', 'max:255'],

            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($userId),
            ],

            'password'  => [
                $this->isMethod('POST') ? 'required' : 'nullable',
                'string',
                'min:8',
            ],

            'is_active' => ['sometimes','required', 'boolean'],
            'role' => ['sometimes','string', 'max:255'],

        ];
    }
}
