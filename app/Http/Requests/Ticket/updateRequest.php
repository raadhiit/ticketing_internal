<?php

namespace App\Http\Requests\Ticket;

use Illuminate\Foundation\Http\FormRequest;

class updateRequest extends FormRequest
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
        return [
            'system_id'   => ['sometimes', 'required', 'exists:systems,id'],
            'title'       => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['sometimes', 'nullable', 'string'],
            'category'    => ['sometimes', 'required', 'in:bug,feature,improvement,support'],

            'priority'    => ['sometimes', 'nullable', 'in:unassigned,low,medium,high,urgent'],
            'status'      => ['sometimes', 'nullable', 'in:open,in_progress,resolved,closed'],
            'due_date'    => ['sometimes', 'nullable', 'date'],
            'assigned_to' => ['sometimes', 'nullable', 'integer', 'exists:users,id'],
            'attachment'  => ['sometimes', 'nullable', 'file', 'mimes:pdf,jpg,jpeg,png,xls', 'max:2048'],
        ];
    }

    public function messages(): array
    {
        return [
            'system_id.required' => 'System wajib dipilih.',
            'system_id.exists'   => 'System tidak valid.',

            'title.required'     => 'Judul wajib diisi.',
            'title.max'          => 'Judul maksimal 255 karakter.',

            'category.required'  => 'Kategori wajib dipilih.',
            'category.in'        => 'Kategori tidak valid.',

            'priority.in'        => 'Priority tidak valid.',
            'status.in'          => 'Status tidak valid.',
            'due_date.date'      => 'Due date tidak valid.',
            'assigned_to.exists' => 'User yang dipilih tidak valid.',
            'attachment.mimes'  => 'Lampiran harus berupa file dengan format: pdf, jpg, jpeg, png, xls.',
            'attachment.max'    => 'Ukuran lampiran maksimal 2MB.',
        ];
    }
}
