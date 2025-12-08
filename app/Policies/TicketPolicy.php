<?php

namespace App\Policies;

use App\Models\Ticket;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class TicketPolicy
{
    use HandlesAuthorization;

    /**
     * Siapa saja yang boleh lihat list ticket (index).
     */
    public function viewAny(User $user): bool
    {
        return
            $user->can('tickets.view.all') ||
            $user->can('tickets.view.own') ||
            $user->can('tickets.view.assigned');
    }

    /**
     * Boleh lihat 1 ticket tertentu?
     */
    public function view(User $user, Ticket $ticket): bool
    {
        // Admin / PM (punya view.all) bisa lihat semua.
        if ($user->can('tickets.view.all')) {
            return true;
        }

        // Boleh lihat ticket yang dia buat sendiri
        if (
            $user->can('tickets.view.own') &&
            (int) $ticket->created_by === (int) $user->id
        ) {
            return true;
        }

        // Boleh lihat ticket yang assigned ke dia
        if (
            $user->can('tickets.view.assigned') &&
            (int) $ticket->assigned_to === (int) $user->id
        ) {
            return true;
        }

        return false;
    }

    /**
     * Boleh create ticket?
     */
    public function create(User $user): bool
    {
        return $user->can('tickets.create');
    }

    /**
     * Boleh update ticket (umum) – misal title/description/due_date.
     * Kalau mau lebih granular, pakai ability custom (updateStatus, assign, setPriority).
     */
    public function update(User $user, Ticket $ticket): bool
    {
        // Admin / PM biasanya punya hak penuh manage ticket
        if ($user->can('tickets.view.all')) {
            // kalau mau lebih strict, lu bisa tambah syarat lain di sini
            return
                $user->can('tickets.update-status') ||
                $user->can('tickets.assign') ||
                $user->can('tickets.set-priority');
        }

        // Dev bisa update status ticket yang dia buat / assigned ke dia
        if ($user->can('tickets.update-status')) {

            // Ticket miliknya sendiri
            if (
                $user->can('tickets.view.own') &&
                (int) $ticket->created_by === (int) $user->id
            ) {
                return true;
            }

            // Ticket yang assigned ke dia
            if (
                $user->can('tickets.view.assigned') &&
                (int) $ticket->assigned_to === (int) $user->id
            ) {
                return true;
            }
        }

        return false;
    }

    /**
     * Boleh delete ticket?
     * Biasanya cuma admin (karena di seeder cuma admin yang punya tickets.delete).
     */
    public function delete(User $user, Ticket $ticket): bool
    {
        return $user->can('tickets.delete');
    }

    /**
     * Ability custom: boleh update STATUS ticket?
     * Pakai ini kalau di controller lu pisah endpoint ganti status.
     */
    public function updateStatus(User $user, Ticket $ticket): bool
    {
        if (! $user->can('tickets.update-status')) {
            return false;
        }

        // Admin / PM
        if ($user->can('tickets.view.all')) {
            return true;
        }

        // Updater adalah creator ticket
        if (
            $user->can('tickets.view.own') &&
            (int) $ticket->created_by === (int) $user->id
        ) {
            return true;
        }

        // Updater adalah dev yang ditugaskan
        if (
            $user->can('tickets.view.assigned') &&
            (int) $ticket->assigned_to === (int) $user->id
        ) {
            return true;
        }

        return false;
    }

    /**
     * Ability custom: assign ticket ke dev lain.
     * Dari seeder, cuma role yang punya tickets.assign yang boleh.
     */
    public function assign(User $user, Ticket $ticket): bool
    {
        return $user->can('tickets.assign');
    }

    /**
     * Ability custom: set PRIORITY ticket.
     */
    public function setPriority(User $user, Ticket $ticket): bool
    {
        return $user->can('tickets.set-priority');
    }

    public function manageTasks(User $user, Ticket $ticket): bool
    {
        // ini bisa lu pakai buat flag UI global (boleh lihat kanban / buka modal, dll)
        if ($user->can('tasks.manage-all')) {
            return true;
        }

        if (
            $user->can('tasks.manage-assigned') &&
            (int) $ticket->assigned_to === (int) $user->id
        ) {
            return true;
        }

        return false;
    }

    /**
     * Boleh CREATE task di ticket ini?
     */
    public function createTask(User $user, Ticket $ticket): bool
    {
        // Admin / PM
        if ($user->can('tasks.manage-all')) {
            return true;
        }

        // Dev → cuma di ticket yg assigned ke dia & punya tasks.create
        if (
            $user->can('tasks.create') &&
            (int) $ticket->assigned_to === (int) $user->id
        ) {
            return true;
        }

        return false;
    }

    public function updateTask(User $user, Ticket $ticket): bool
    {
        // Admin / PM
        if ($user->can('tasks.manage-all')) {
            return true;
        }

        // Dev → ticket assigned ke dia & punya tasks.update
        if (
            $user->can('tasks.update') &&
            (int) $ticket->assigned_to === (int) $user->id
        ) {
            return true;
        }

        return false;
    }

    /**
     * Bisa reorder tasks di kanban?
     */
    public function reorderTasks(User $user, Ticket $ticket): bool
    {
        // Admin / PM → bebas
        if ($user->can('tasks.manage-all')) {
            return true;
        }

        // Dev → boleh reorder task di ticket yang dia pegang
        if (
            $user->can('tasks.manage-assigned') &&
            (int) $ticket->assigned_to === (int) $user->id
        ) {
            return true;
        }

        return false;
    }

    /**
     * Boleh delete task di ticket ini?
     * Dari permission yang lu bikin, lu maunya ini cuma admin/PM.
     */
    public function deleteTask(User $user, Ticket $ticket): bool
    {
        // Admin / PM
        if ($user->can('tasks.manage-all')) {
            return true;
        }

        // Dev → ticket assigned ke dia & punya tasks.delete
        if (
            $user->can('tasks.delete') &&
            (int) $ticket->assigned_to === (int) $user->id
        ) {
            return true;
        }

        return false;
    }
}
