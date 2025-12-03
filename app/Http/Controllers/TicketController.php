<?php

namespace App\Http\Controllers;

use Throwable;
use Carbon\Carbon;
use App\Models\User;
use Inertia\Inertia;
use App\Models\system;
use App\Models\ticket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Requests\Ticket\StoreRequest;
use App\Http\Requests\Ticket\updateRequest;

class TicketController extends Controller
{

    protected function generateTicketCode()
    {
        $lastTicket = Ticket::withTrashed()
            ->lockForUpdate()       // kunci row selama transaksi
            ->orderByDesc('id')
            ->first();

        if ($lastTicket && preg_match('/(\d+)$/', $lastTicket->code, $m)) {
            $nextNumber = (int) $m[1] + 1;
        } else {
            $nextNumber = 1;
        }

        return 'TCK-' . str_pad($nextNumber, 4, '0', STR_PAD_LEFT);
    }


    public function index(Request $request)
    {
        $user = $request->user();

        $query = ticket::with([
            'system:id,code',
            'createdBy:id,name',
            'assignedTo:id,name',
            'attachments:id,ticket_id,original_name,path'
        ]);

        if ($user->hasRole('user')) {
            $query->where('created_by', $user->id);
        } elseif ($user->hasRole('dev')) {
            $query->where('assigned_to', $user->id);
        }

        $simpleFilters = $request->only([
            'system_id',
            'category',
            'priority',
            'status',
        ]);

        foreach ($simpleFilters as $field => $value) {
            if ($value !== null && $value !== '') {
                $query->where($field, $value);
            }
        }
        // $tickets = $query->latest()->paginate(10)->withQueryString();
        $tickets = $query
            ->latest()
            ->paginate(10)
            ->withQueryString()
            ->through(function (Ticket $ticket) {
                return [
                    'id'          => $ticket->id,
                    'code'        => $ticket->code,
                    'title'       => $ticket->title,
                    'description' => $ticket->description,

                    'system_id'   => $ticket->system_id,
                    'system_code' => $ticket->system?->code, // ⬅️ INI YANG DIBACA TABLE

                    'category'    => $ticket->category,
                    'priority'    => $ticket->priority,
                    'status'      => $ticket->status,
                    'due_date' => $ticket->due_date
                        ? Carbon::parse($ticket->due_date)->format('Y-m-d')
                        : null,

                    'createdBy'   => [
                        'id'   => $ticket->createdBy->id,
                        'name' => $ticket->createdBy->name,
                    ],
                    'assigned_to' => $ticket->assigned_to,
                    'assignedTo'  => $ticket->assignedTo
                        ? [
                            'id'   => $ticket->assignedTo->id,
                            'name' => $ticket->assignedTo->name,
                        ]
                        : null,
                    'attachments' => $ticket->attachments->map(function ($att) {
                        return [
                            'id'            => $att->id,
                            'original_name' => $att->original_name,
                            'url'           => asset('storage/' . $att->path),
                        ];
                    }),
                    'created_at'  => $ticket->created_at?->toDateTimeString(),
                        'updated_at'  => $ticket->updated_at?->toDateTimeString(),
                    ];
            });

        $systems = system::orderBy('code')->get(['id', 'code']);

        $categories = ['bug', 'feature', 'improvement', 'support'];
        $priorities = ['unassigned', 'low', 'medium', 'high', 'urgent'];
        $statuses = ['open', 'in_progress', 'resolved', 'closed'];

        $canAssign = $user->hasRole(['admin', 'pm']);
        $canManagePriority = $canAssign;
        $canManageStatus = $canAssign;

        $assignees = $canAssign 
            ? User::role('dev')
                ->where('is_active', true)
                ->orderBy('name')
                ->get(['id', 'name'])
            : collect();

        return Inertia::render('tickets/page', [
            'tickets'           => $tickets,
            'systems'           => $systems,
            'categories'        => $categories,
            'priorities'        => $priorities,
            'statuses'          => $statuses,
            'canCreate'         => $user->can('tickets.create'),
            'canAssign'         => $canAssign,
            'canManagePriority' => $canManagePriority,
            'canManageStatus'   => $canManageStatus,
            'assignees'         => $assignees,
            'filters'          => $simpleFilters,
        ]);
    }

    public function store(StoreRequest $request)
    {
        $user = $request->user();

        $canAssign = $user->hasAnyRole(['admin', 'pm']);
        $canManagePriority = $canAssign;
        $canManageStatus = $canAssign;

        $validated = $request->validated();

        try {
            DB::transaction(function () use ($validated, $user, $canAssign, $canManagePriority, $canManageStatus, $request) {
                $payload = $validated;

                $payload['created_by'] = $user->id;
                $payload['code']       = $this->generateTicketCode();

                // PRIORITY
                if ($canManagePriority) {
                    $payload['priority'] = $payload['priority'] ?? 'unassigned';
                } else {
                    $payload['priority'] = 'unassigned';
                }

                // STATUS
                if ($canManageStatus) {
                    $payload['status'] = $payload['status'] ?? 'open';
                } else {
                    $payload['status'] = 'open';
                }

                // ASSIGNED_TO
                if ($canAssign && !empty($payload['assigned_to'])) {
                    $assignee = User::whereKey($payload['assigned_to'])
                        ->where('is_active', true)
                        ->role('dev')
                        ->first();

                    $payload['assigned_to'] = $assignee?->id;
                } else {
                    $payload['assigned_to'] = null;
                }

                $ticket = Ticket::create($payload);

                if ($request->hasFile('attachment')) {
                    $file = $request->file('attachment');

                    $path = $file->store('ticket_attachments', 'public');

                    $ticket->attachments()->create([
                        'original_name' => $file->getClientOriginalName(),
                        'path'          => $path,
                        'mime_type'     => $file->getClientMimeType(),
                        'size'          => $file->getSize(),
                    ]);
                }
            });

            return back()->with('success', 'Ticket created.');
        }catch(Throwable $th) {
            Log::error('Error create ticket', [
                'message' => $th->getMessage(),
                'file' => $th->getFile(),
                'line' => $th->getLine(),
            ]);

            return back()->with('error', 'Failed to create ticket.');
        }
    }

    public function update(updateRequest $request, ticket $ticket)
    {

        Log::info('DEBUG UPDATE TICKET', [
            'method'   => $request->method(),
            'all'      => $request->all(),
            'has_file' => $request->hasFile('attachment'),
            'file'     => $request->file('attachment'),
        ]);

        $user = $request->user();
        $canAssign = $user->hasAnyRole(['admin', 'pm']);
        $canManagePriority = $canAssign;
        $canManageStatus = $canAssign;
        $validated = $request->validated();

        try{
            DB::transaction(function () use ($request, $validated, $ticket, $canAssign, $canManagePriority, $canManageStatus) {
                $payload = $validated;

                // jangan izinkan update field sensitif lewat mass assign
                unset($payload['created_by'], $payload['code']);

                // PRIORITY
                if ($canManagePriority) {
                    if (!array_key_exists('priority', $payload) || $payload['priority'] === null) {
                        $payload['priority'] = $ticket->priority;
                    }
                } else {
                    unset($payload['priority']);
                }

                // STATUS
                if ($canManageStatus) {
                    if (!array_key_exists('status', $payload) || $payload['status'] === null) {
                        $payload['status'] = $ticket->status;
                    }
                } else {
                    unset($payload['status']);
                }

                // ASSIGNED_TO
                if ($canAssign && array_key_exists('assigned_to', $payload)) {
                    if ($payload['assigned_to']) {
                        $assignee = User::whereKey($payload['assigned_to'])
                            ->where('is_active', true)
                            ->role('dev')
                            ->first();

                        $payload['assigned_to'] = $assignee?->id;
                    } else {
                        $payload['assigned_to'] = null;
                    }
                } else {
                    unset($payload['assigned_to']);
                }

                $ticket->update($payload);

                if ($request->hasFile('attachment')) {
                    $file = $request->file('attachment');

                    $path = $file->store('ticket_attachments', 'public');

                    $ticket->attachments()->create([
                        'original_name' => $file->getClientOriginalName(),
                        'path'          => $path,
                        'mime_type'     => $file->getClientMimeType(),
                        'size'          => $file->getSize(),
                    ]);
                }
            });

            return back()->with('success', 'Ticket updated.');
        }catch(Throwable $th){
            Log::error('Error update ticket', [
                'message' => $th->getMessage(),
                'file' => $th->getFile(),
                'line' => $th->getLine(),
            ]);
            return back()->with('error', $th->getMessage());
        }
    }
}
