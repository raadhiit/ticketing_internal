<?php

namespace App\Services;

use Carbon\Carbon;
use App\Models\User;
use App\Models\ticket;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Pagination\LengthAwarePaginator;

class TicketServices
{
    public function history(
        User $user,
        Request $request,
        int $perPage = 5
    ): LengthAwarePaginator {
        $query = Ticket::query()
            ->visibleTo($user)
            ->whereIn('status', ['open', 'in_progress'])
            ->select([
                'id',
                'code',
                'title',
                'status',
                'category',
                'priority',
                'system_id',
                'created_at',
            ])
            ->with(['system:id,code']);

        if ($request->filled('q')) {
            $query->where('code', 'like', '%' . $request->q . '%');
        }

        $from = $request->filled('date_from')
            ? Carbon::parse($request->date_from)->startOfDay()
            : now()->startOfDay();

        $to = $request->filled('date_to')
            ? Carbon::parse($request->date_to)->endOfDay()
            : now()->endOfDay();

        return $query
            ->whereBetween('created_at', [$from, $to])
            ->orderByDesc('created_at')
            ->paginate($perPage)
            ->withQueryString()
            ->through(fn(Ticket $ticket) => [
                'id'        => $ticket->id,
                'code'      => $ticket->code,
                'title'     => $ticket->title,
                'status'    => $ticket->status,
                'category'  => $ticket->category,
                'priority'  => $ticket->priority,
                'system'    => $ticket->system?->code,
                'createdAt' => optional($ticket->created_at)
                    ->format('Y-m-d H:i:s'),
            ]);
    }
}
