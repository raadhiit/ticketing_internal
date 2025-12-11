<?php

namespace App\Services;

use App\Models\User;
use App\Models\ticket;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Pagination\LengthAwarePaginator;

class TicketServices
{
    public function visibleQueryFor(User $user): Builder 
    {
        $query = ticket::query();

        $from = Carbon::now()->subMonth()->startOfDay();
        $query->where('created_at', '>=', $from);

        if ($user->can('tickets.view.all')) {
            return $query;
        }

        return $query->where(function (Builder $q) use ($user) {
            if ($user->can('tickets.view.own')) {
                $q->orWhere('created_by', $user->id);
            }

            if ($user->can('tickets.view.assigned')) {
                $q->orWhere('assigned_to', $user->id);
            }
        });
    }

    public function getHistoryForUser(User $user, int $perPage = 10): LengthAwarePaginator
    {
        return $this->visibleQueryFor($user)
            ->with([
                'system:id,code',
            ])
            ->latest()
            ->paginate($perPage)
            ->withQueryString()
            ->through(function (ticket $ticket) {
                return [
                    'code'      => $ticket->code,
                    'title'     => $ticket->title,
                    'status'    => $ticket->status,
                    'category'  => $ticket->category,
                    'system'    => $ticket->system?->code,
                    'priority'    => $ticket->priority,
                    'createdAt'   => optional($ticket->created_at)->format('Y-m-d H:i:s'),
                ];
            });
    }
}