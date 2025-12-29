<?php

namespace Database\Seeders;

use App\Models\Equipment;
use App\Models\Locality;
use Illuminate\Database\Seeder;

class EquipmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $equipments = [
            [
                'id' => 'EST001',
                'location' => 'Estación de monitoreo 1',
                'latitude' => 23.1367,
                'longitude' => -82.3589,
                'imei' => '123456789012345',
                'phone' => '+53555123456',
                'channel' => null,
                'basin' => 'Cuenca Norte',
                'locality_id' => 7, // Vedado - La Habana
            ],
            [
                'id' => 'EST002',
                'location' => 'Estación de monitoreo 2',
                'latitude' => 20.3769,
                'longitude' => -76.6436,
                'imei' => '123456789012346',
                'phone' => '+53555123457',
                'channel' => null,
                'basin' => 'Cuenca Sur',
                'locality_id' => 11, // Centro - Bayamo
            ],
            [
                'id' => 'EST003',
                'location' => 'Estación de monitoreo 3',
                'latitude' => 19.9855,
                'longitude' => -75.8483,
                'imei' => '123456789012347',
                'phone' => '+53555123458',
                'channel' => null,
                'basin' => 'Cuenca Este',
                'locality_id' => 15, // Vista Alegre - Santiago de Cuba
            ],
            [
                'id' => 'EST004',
                'location' => 'Estación de monitoreo 4',
                'latitude' => 23.0500,
                'longitude' => -82.3667,
                'imei' => '123456789012348',
                'phone' => '+53555123459',
                'channel' => null,
                'basin' => 'Cuenca Oeste',
                'locality_id' => 9, // Miramar - Playa
            ],
            [
                'id' => 'EST005',
                'location' => 'Estación de monitoreo 5',
                'latitude' => 20.3433,
                'longitude' => -76.7572,
                'imei' => '123456789012349',
                'phone' => '+53555123460',
                'channel' => null,
                'basin' => 'Cuenca Central',
                'locality_id' => 13, // Costa - Manzanillo
            ],
        ];

        foreach ($equipments as $equipment) {
            $locality = Locality::find($equipment['locality_id']);
            if ($locality) {
                Equipment::firstOrCreate(
                    ['id' => $equipment['id']],
                    [
                        'location' => $equipment['location'],
                        'latitude' => $equipment['latitude'],
                        'longitude' => $equipment['longitude'],
                        'imei' => $equipment['imei'],
                        'phone' => $equipment['phone'],
                        'channel' => $equipment['channel'],
                        'basin' => $equipment['basin'],
                        'locality_id' => $equipment['locality_id'],
                    ]
                );
            }
        }
    }
}

