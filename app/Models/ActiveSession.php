<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ActiveSession extends Model
{
    protected $fillable = [
        'user_id',
        'token',
        'login_time',
        'last_activity',
        'ip_address',
        'user_agent',
    ];

    protected function casts(): array
    {
        return [
            'login_time' => 'datetime',
            'last_activity' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}

