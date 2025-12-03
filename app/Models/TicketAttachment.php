<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TicketAttachment extends Model
{
    protected $fillable = [
        'ticket_id',
        'original_name',
        'path',
        'mime_type',
        'size',
    ];

    public function ticket()
    {
        return $this->belongsTo(ticket::class);
    }


    public function getUrlAttribute(): string
    {
        return asset('storage/' . $this->path);
    }
}
