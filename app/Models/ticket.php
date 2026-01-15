<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ticket extends Model
{
    use SoftDeletes;
    protected $fillable = [
        'system_id',
        'created_by',
        'assigned_to',
        'code',
        'title',
        'description',
        'category',
        'priority',
        'status',
        'due_date',
        'dept_id'
    ];

    public function system()
    {
        return $this->belongsTo(System::class);
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function department()
    {
        return $this->belongsTo(departments::class, 'dept_id');
    }

    public function assignedTo()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function attachments()
    {
        return $this->hasMany(TicketAttachment::class);
    }

    public function tasks()
    {
        return $this->hasMany(tasks::class);
    }

    public function scopeVisibleTo(Builder $query, User $user)
    {
        if ($user->can('tickets.view.all')){
            return $query;
        }

        if ($user->can('tickets.view.own') && !$user->can('tickets.view.assigned')) {
            return $query->where('created_by', $user->id);
        }

        if (!$user->can('tickets.view.own') && $user->can('tickets.view.assigned')) {
            return $query->where('assigned_to', $user->id);
        }

        return $query->where(function (Builder $q) use ($user) {
            $q->where('created_by', $user->id)
                ->orWhere('assigned_to', $user->id);
        });
    }

    public function scopeForUserRole($query, User $user)
    {
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
}
