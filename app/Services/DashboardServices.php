<?php

namespace App\Services;

use Carbon\Carbon;
use App\Models\User;
use App\Models\ticket;

class DashboardServices
{
    public function summary(
        User $user,
        Carbon $from,
        Carbon $to
    ): array {
        $rows = Ticket::query()
            ->visibleTo($user)
            ->whereBetween('created_at', [$from, $to])
            ->selectRaw('status, COUNT(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');

        return [
            $this->card('active',   'Active Tickets',   'open',        'Tickets currently open', $rows),
            $this->card('pending',  'Pending Tickets',  'in_progress', 'Tickets in progress', $rows),
            $this->card('resolved', 'Resolved Tickets', 'resolved',    'Tickets resolved', $rows),
            $this->card('closed',   'Closed Tickets',   'closed',      'Tickets closed', $rows),
        ];
    }

    private function card(
        string $id,
        string $label,
        string $status,
        string $description,
        $rows
    ): array {
        return [
            'id'          => $id,
            'label'       => $label,
            'value'       => (int) ($rows[$status] ?? 0),
            'description' => $description,
            'status'      => $status,
        ];
    }
}
