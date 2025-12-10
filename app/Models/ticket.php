<?php

namespace App\Models;

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

    public function scopeForUserRole($query, User $user)
    {
        if ($user->hasRole('user')) {
            // user biasa: cuma liat ticket yang dia buat
            return $query->where('created_by', $user->id);
        }

        if ($user->hasRole('dev')) {
            // dev: cuma liat ticket yang assigned ke dia
            return $query->where('assigned_to', $user->id);
        }

        // admin / pm: liat semua
        return $query;
    }
}
