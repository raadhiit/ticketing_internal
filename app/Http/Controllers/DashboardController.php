<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Services\TicketServices;
use App\Services\DashboardServices;

class DashboardController extends Controller
{
    public function index(Request $request, DashboardServices $dashboardServices, TicketServices $ticketServices)
    {
        $user = $request->user();
        
        $from = $request->filled('date_from')
            ? Carbon::parse($request->date_from)->startOfDay()
            : now()->startOfDay();

        $to = $request->filled('date_to')
            ? Carbon::parse($request->date_to)->endOfDay()
            : now()->endOfDay();

        return Inertia::render('dashboard/Dashboard', [
            'summaryCards' => $dashboardServices->summary($user, $from, $to),
            'ticketHistory' => $ticketServices->history($user, $request),
            'filters' => [
                'date_from' => $from->toDateString(),
                'date_to'   => $to->toDateString(),
                'q'         => $request->q,
            ],
        ]);
    }
}