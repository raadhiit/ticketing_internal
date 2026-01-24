<?php

namespace App\Http\Requests\Ticket;

use Illuminate\Foundation\Http\FormRequest;

class StoreRequest extends FormRequest
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
            'system_id' => [
                'required',
                'exists:systems,id'
            ],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'category_id' => ['required', 'exists:ticket_categories.id'],
            'priority' => ['required', 'in:unassigned,low,medium,high,urgent'],
            'status' => ['required', 'in:open,in_progress,resolved,closed'],
            'due_date' => ['nullable', 'date'],
            'assigned_to' => ['nullable', 'exists:users,id'],
            'attachment'  => ['nullable', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:2048'],
        ];
    }

    public function messages(): array
    {
        return [
            'system_id.required' => 'System wajib dipilih.',
            'system_id.exists'   => 'System tidak valid.',
            'title.required'     => 'Judul wajib diisi.',
            'title.max'          => 'Judul maksimal 255 karakter.',
            'category_id.required'  => 'Kategori wajib dipilih.',
            'priority.in'        => 'Priority tidak valid.',
            'status.in'          => 'Status tidak valid.',
            'due_date.date'      => 'Due date tidak valid.',
            'assigned_to.exists' => 'User yang dipilih tidak valid.',
        ];
    }
}
