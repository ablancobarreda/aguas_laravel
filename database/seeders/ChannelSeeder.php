<?php

namespace Database\Seeders;

use App\Models\Channel;
use Illuminate\Database\Seeder;

class ChannelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $channels = [
            [
                'id' => 1,
                'name' => '01',
                'col_rel' => 'vals',
                'variable' => 'Lluvia actual 5min',
                'unidad_medida' => 'mm',
                'es_acuifero' => true,
            ],
            [
                'id' => 2,
                'name' => '03',
                'col_rel' => 'vals',
                'variable' => 'Acum. Lluvia Hoy',
                'unidad_medida' => 'mm',
                'es_acuifero' => true,
            ],
            [
                'id' => 3,
                'name' => '15',
                'col_rel' => 'sigs',
                'variable' => 'Intensidad de la señal',
                'unidad_medida' => 'dB',
                'es_acuifero' => false,
            ],
            [
                'id' => 4,
                'name' => '16',
                'col_rel' => 'nwtype',
                'variable' => 'Conexion',
                'unidad_medida' => null,
                'es_acuifero' => false,
            ],
            [
                'id' => 5,
                'name' => '31',
                'col_rel' => 'powr',
                'variable' => 'Energia',
                'unidad_medida' => null,
                'es_acuifero' => false,
            ],
            [
                'id' => 6,
                'name' => '32',
                'col_rel' => 'batt',
                'variable' => 'Batería',
                'unidad_medida' => '%',
                'es_acuifero' => false,
            ],
            [
                'id' => 7,
                'name' => '02',
                'col_rel' => 'vals',
                'variable' => 'Lluvia Ult Hora',
                'unidad_medida' => 'mm',
                'es_acuifero' => true,
            ],
            [
                'id' => 8,
                'name' => '05',
                'col_rel' => 'vals',
                'variable' => 'Acum. Lluvia Ayer',
                'unidad_medida' => 'mm',
                'es_acuifero' => true,
            ],
        ];

        foreach ($channels as $channel) {
            Channel::firstOrCreate(
                ['id' => $channel['id']],
                [
                    'name' => $channel['name'],
                    'col_rel' => $channel['col_rel'],
                    'variable' => $channel['variable'],
                    'unidad_medida' => $channel['unidad_medida'],
                    'es_acuifero' => $channel['es_acuifero'],
                ]
            );
        }
    }
}
