<?php

namespace App\Http\Requests\Tasks;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
        // $user = $this->user();
        // if (! $user) {
        //     return false;
        // }

        // /** @var Ticket|null $ticket */
        // $ticket = $this->route('ticket');
        // /** @var Task|null $task */
        // $task = $this->route('task');

        // if (! $ticket || ! $task) {
        //     return false;
        // }

        // // Safety: pastikan task memang milik ticket ini
        // if ($task->ticket_id !== $ticket->id) {
        //     return false;
        // }

        // // user biasa tidak boleh update task
        // if ($user->hasRole('user')) {
        //     return false;
        // }

        // // admin & pm boleh update task apa saja
        // if ($user->hasAnyRole(['admin', 'pm'])) {
        //     return true;
        // }

        // // dev: hanya boleh update task miliknya sendiri
        // if ($user->hasRole('dev') && $task->assignee_id === $user->id) {
        //     return true;
        // }

        // return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title'       => ['sometimes', 'string', 'max:255'],
            'description' => ['sometimes', 'nullable', 'string'],
            'status'      => ['sometimes', 'in:todo,in_progress,review,done'],
            'assignee_id' => ['sometimes', 'nullable', 'exists:users,id'],
            'position'    => ['sometimes', 'integer', 'min:1'],
        ];
    }
}
