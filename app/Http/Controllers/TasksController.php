<?php

namespace App\Http\Controllers;

use Throwable;
use App\Models\tasks;
use App\Models\ticket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Requests\Tasks\StoreRequest;
use App\Http\Requests\Tasks\UpdateRequest;

class TasksController extends Controller
{
    public function store(StoreRequest $request, ticket $ticket)
    {
        $this->authorize('createTask', $ticket);

        $data = $request->validated();
        $status = $data['status'] ?? 'todo';

        try {
            DB::transaction(function () use ($ticket, $data, $status) {
                $maxPosition = tasks::where('ticket_id', $ticket->id)
                    ->where('status', $status)
                    ->max('position');

                $position = $maxPosition ? $maxPosition + 1 : 1;

                tasks::create([
                    'ticket_id'   => $ticket->id,
                    'title'       => $data['title'],
                    'description' => $data['description'] ?? null,
                    // default ke assignee ticket kalau gak diisi
                    'assignee_id' => $data['assignee_id'] ?? $ticket->assigned_to,
                    'status'      => $status,
                    'position'    => $position,
                ]);

                $this->syncTicketStatus($ticket);
            });

            return back()->with('success', 'Task created.');
        } catch (Throwable $th) {
            Log::error('Error create task', [
                'ticket_id' => $ticket->id,
                'message'   => $th->getMessage(),
                'file'      => $th->getFile(),
                'line'      => $th->getLine(),
            ]);

            return back()->with('error', $th->getMessage());
        }
    }

    public function update(UpdateRequest $request, ticket $ticket, tasks $task)
    {
        $this->authorize('updateTask', $ticket);

        $user = $request->user();

        if($task->ticket_id !== $ticket->id) {
            abort(403, 'Task does not belong to the specified ticket.');
        }

        $data = $request->validated();

        if (! $user->can('tasks.manage-all')) {
            // Dev cuma boleh ubah status + description
            $data = collect($data)
                ->only(['title', 'description', 'status'])
                ->toArray();

            // Safety ekstra: dev cuma boleh sentuh task yang assigned ke dia
            if ((int) $task->assignee_id !== (int) $user->id) {
                abort(403, 'You are not allowed to update this task.');
            }
        }
        try {
            DB::transaction(function () use ($ticket, $task, $data) {
                $oldStatus   = $task->status;
                $oldPosition = $task->position;

                if (array_key_exists('status', $data) && $data['status'] !== $oldStatus) {
                    $newStatus = $data['status'];

                    // rapihin posisi di kolom lama (geser yg di bawahnya naik)
                    tasks::where('ticket_id', $task->ticket_id)
                        ->where('status', $oldStatus)
                        ->where('position', '>', $oldPosition)
                        ->decrement('position');

                    // hitung posisi baru di kolom baru
                    $maxPosition = tasks::where('ticket_id', $task->ticket_id)
                        ->where('status', $newStatus)
                        ->max('position');

                    $data['position'] = $maxPosition ? $maxPosition + 1 : 1;
                }

                $task->update($data);

                // sync status ticket berdasar tasks
                $this->syncTicketStatus($ticket->fresh('tasks'));
            });

            return back()->with('success', 'Task updated.');
        } catch (Throwable $th) {
            Log::error('Error update task', [
                'task_id'   => $task->id,
                'ticket_id' => $ticket->id,
                'message'   => $th->getMessage(),
                'file'      => $th->getFile(),
                'line'      => $th->getLine(),
            ]);

            return back()->with('error', $th->getMessage());
        }

    }

    public function destroy(Request $request, tasks $task, ticket $ticket)
    {
        $this->authorize('deleteTask', $ticket);

        $user = $request->user();

        if ($task->ticket_id !== $ticket->id) {
            abort(404);
        }

        $this->authorize('deleteTask', $ticket);

        try {
            DB::transaction(function () use ($ticket, $task) {
                $ticketId = $task->ticket_id;
                $status   = $task->status;
                $position = $task->position;

                $task->delete();

                // rapihin posisi di kolom yang sama
                tasks::where('ticket_id', $ticketId)
                    ->where('status', $status)
                    ->where('position', '>', $position)
                    ->decrement('position');

                $this->syncTicketStatus($ticket->fresh('tasks'));
            });

            return back()->with('success', 'Task deleted.');
        } catch (Throwable $th) {
            Log::error('Error delete task', [
                'task_id'   => $task->id,
                'ticket_id' => $ticket->id,
                'message'   => $th->getMessage(),
                'file'      => $th->getFile(),
                'line'      => $th->getLine(),
            ]);

            return back()->with('error', $th->getMessage());
        }
    }

    public function reorder(Request $request, Ticket $ticket)
    {
        $user = $request->user();

        $this->authorize('reorderTasks', $ticket);
        
        $data = $request->validate([
            'columns'   => ['required', 'array'],
        ]);

        $columns = $data['columns'];

        try {
            DB::transaction(function () use ($ticket, $columns, $user) {
                foreach ($columns as $status => $tasks) {
                    // $tasks = array of ['id' => int, ...]
                    foreach ($tasks as $index => $taskData) {
                        $taskId = $taskData['id'] ?? null;
                        if (! $taskId) {
                            continue;
                        }

                        $task = tasks::where('ticket_id', $ticket->id)
                            ->where('id', $taskId)
                            ->first();

                        if (! $task) {
                            continue;
                        }

                        // dev hanya boleh geser task miliknya
                        if ($user->hasRole('dev') && ! $user->hasAnyRole(['admin', 'pm']) && $task->assignee_id !== $user->id) {
                            continue;
                        }

                        $task->update([
                            'status'   => $status,
                            'position' => $index + 1,
                        ]);
                    }
                }

                $this->syncTicketStatus($ticket->fresh('tasks'));
            });

            return back()->with('success', 'Tasks reordered.');
        } catch (Throwable $th) {
            Log::error('Error reorder tasks', [
                'ticket_id' => $ticket->id,
                'message'   => $th->getMessage(),
                'file'      => $th->getFile(),
                'line'      => $th->getLine(),
            ]);

            return back()->with('error', $th->getMessage());
        }
    }

    protected function syncTicketStatus(Ticket $ticket): void
    {
        $ticket->loadMissing('tasks');

        $tasks = $ticket->tasks;

        if ($tasks->isEmpty()) {
            return;
        }

        $counts = $tasks->groupBy('status')->map->count();

        $currentStatus = $ticket->status;

        // kalau ticket sudah closed, jangan utak-atik
        if ($currentStatus === 'closed') {
            return;
        }

        $todo        = $counts->get('todo', 0);
        $inProgress  = $counts->get('in_progress', 0);
        $review      = $counts->get('review', 0);
        $done        = $counts->get('done', 0);
        $total       = $todo + $inProgress + $review + $done;

        if ($total > 0 && $done === $total) {
            // semua task selesai
            if ($currentStatus !== 'resolved') {
                $ticket->update(['status' => 'resolved']);
            }
            return;
        }

        if ($inProgress > 0 || $review > 0) {
            if ($currentStatus === 'open') {
                $ticket->update(['status' => 'in_progress']);
            }
            return;
        }

        // kalau cuma todo, biarin (biasanya open)
    }
}
