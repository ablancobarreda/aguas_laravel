<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Channel extends Model
{
    protected $fillable = [
        'name',
        'col_rel',
        'variable',
        'unidad_medida',
        'es_acuifero',
    ];

    protected function casts(): array
    {
        return [
            'es_acuifero' => 'boolean',
        ];
    }

    public function equipment(): BelongsToMany
    {
        return $this->belongsToMany(Equipment::class, 'equipment_channels')
            ->withTimestamps();
    }
}

