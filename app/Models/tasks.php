<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class tasks extends Model
{
    protected $fillable = [
        'ticket_id',
        'assignee_id',
        'title',
        'description',
        'status',
        'position',
    ];

    public function ticket()
    {
        return $this->belongsTo(Ticket::class);
    }

    public function assignee()
    {
        return $this->belongsTo(User::class, 'assignee_id');
    }
}
