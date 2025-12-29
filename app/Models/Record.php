<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Record extends Model
{
    protected $fillable = [
        'ip',
        'cmd',
        'phone',
        'imei',
        'time',
        'start_time',
        'end_time',
        'record_date',
        'vals',
        'batt',
        'powr',
        'sigs',
        'nwtype',
    ];

    public function equipment(): BelongsTo
    {
        return $this->belongsTo(Equipment::class, 'imei', 'imei');
    }
}

