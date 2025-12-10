<?php

namespace App\Http\Controllers;

use App\Models\ticket;
use App\Services\DashboardServices;
use App\Services\TicketServices;
use Inertia\Inertia;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request, DashboardServices $dashboardServices, TicketServices $ticketServices)
    {
        $user = $request->user();
        $this->authorize('viewAny', ticket::class);

        $summaryCard = $dashboardServices->summaryCard($user);
        $ticketHistory = $ticketServices->getHistoryForUser($user, 10);

        $raw = $ticketHistory->toArray();

        $ticketHistoryForFrontend = [
            'data' => $raw['data'] ?? [],
            'links' => array_map(function ($l) {
                $label = $l['label'] ?? '';

                // normalize previous / next to plain words
                if (str_contains($label, 'pagination.previous')) {
                    $label = 'Previous';
                } elseif (str_contains($label, 'pagination.next')) {
                    $label = 'Next';
                } else {
                    // strip html entities/tags just in case
                    $label = strip_tags((string) $label);
                }

                return [
                    'url'    => $l['url'] ?? null,
                    'label'  => $label,
                    'active' => $l['active'] ?? false,
                ];
            }, $raw['links'] ?? []),
            'meta' => [
                'current_page' => $raw['current_page'] ?? 1,
                'last_page'    => $raw['last_page'] ?? 1,
                'per_page'     => $raw['per_page'] ?? count($raw['data'] ?? []),
                'total'        => $raw['total'] ?? count($raw['data'] ?? []),
            ],
        ];

        return Inertia::render('dashboard/Dashboard', [
            'summaryCards' => $summaryCard,
            // 'ticketHistory' => $ticketHistory
            'ticketHistory' => $ticketHistoryForFrontend
        ]);
    }
}
