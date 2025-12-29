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
                'name' => 'Nivel',
                'col_rel' => 'col1',
                'variable' => 'Nivel de agua',
                'unidad_medida' => 'm',
                'es_acuifero' => false,
            ],
            [
                'id' => 2,
                'name' => 'Temperatura',
                'col_rel' => 'col2',
                'variable' => 'Temperatura del agua',
                'unidad_medida' => '°C',
                'es_acuifero' => false,
            ],
            [
                'id' => 3,
                'name' => 'Conductividad',
                'col_rel' => 'col3',
                'variable' => 'Conductividad eléctrica',
                'unidad_medida' => 'μS/cm',
                'es_acuifero' => false,
            ],
            [
                'id' => 4,
                'name' => 'Nivel Acuífero',
                'col_rel' => 'col4',
                'variable' => 'Nivel del acuífero',
                'unidad_medida' => 'm',
                'es_acuifero' => true,
            ],
            [
                'id' => 5,
                'name' => 'pH',
                'col_rel' => 'col5',
                'variable' => 'pH del agua',
                'unidad_medida' => 'pH',
                'es_acuifero' => false,
            ],
            [
                'id' => 6,
                'name' => 'Oxígeno Disuelto',
                'col_rel' => 'col6',
                'variable' => 'Oxígeno disuelto',
                'unidad_medida' => 'mg/L',
                'es_acuifero' => false,
            ],
            [
                'id' => 7,
                'name' => 'Turbidez',
                'col_rel' => 'col7',
                'variable' => 'Turbidez',
                'unidad_medida' => 'NTU',
                'es_acuifero' => false,
            ],
            [
                'id' => 8,
                'name' => 'Caudal',
                'col_rel' => 'col8',
                'variable' => 'Caudal',
                'unidad_medida' => 'L/s',
                'es_acuifero' => false,
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

