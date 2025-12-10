<?php

namespace App\Services;

use App\Models\ticket;
use App\Models\User;

class DashboardServices
{
    public function summaryCard(User $user): array
    {
        $rows = ticket::forUserRole($user)
            ->selectRaw('status, COUNT(*) as total' )
            ->groupBy('status')
            ->pluck('total', 'status');

        return [
            [
                'id'          => 'active',
                'label'       => 'Active Tickets',
                'value'       => (int) ($rows['open'] ?? 0),
                'description' => 'Tickets currently open',
                // bg lembut, beda light/dark
                'accentClass' => 'bg-emerald-100 dark:bg-emerald-500/40',
                // icon warna kuat
                'iconClass'   => 'text-emerald-600 dark:text-emerald-700',
            ],
            [
                'id'          => 'pending',
                'label'       => 'Pending Tickets',
                'value'       => (int) ($rows['in_progress'] ?? 0),
                'description' => 'Tickets in progress',
                'accentClass' => 'bg-amber-100 dark:bg-amber-500/20',
                'iconClass'   => 'text-amber-600 dark:text-amber-700',
            ],
            [
                'id'          => 'resolved',
                'label'       => 'Resolved Tickets',
                'value'       => (int) ($rows['resolved'] ?? 0),
                'description' => 'Tickets resolved',
                'accentClass' => 'bg-sky-100 dark:bg-sky-500/20',
                'iconClass'   => 'text-sky-600 dark:text-sky-700',
            ],
            [
                'id'          => 'closed',
                'label'       => 'Closed Tickets',
                'value'       => (int) ($rows['closed'] ?? 0),
                'description' => 'Tickets closed',
                // closed = merah sendiri, jelas beda
                'accentClass' => 'bg-rose-100 dark:bg-rose-700',
                'iconClass'   => 'text-rose-600 dark:text-rose-700',
            ],
        ];
    }
}