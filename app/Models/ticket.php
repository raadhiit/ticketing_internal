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
    ];

    // protected $dates = [
    //     'due_date',
    //     'deleted_at',
    // ];

    public function system()
    {
        return $this->belongsTo(System::class);
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function assignedTo()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function attachments()
    {
        return $this->hasMany(TicketAttachment::class);
    }
}
