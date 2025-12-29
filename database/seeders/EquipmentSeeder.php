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
                'id' => 'UCL13300',
                'location' => 'Desarrollo',
                'latitude' => 20.37295900,
                'longitude' => -76.63873277,
                'imei' => '862636052186861',
                'phone' => '53521603212',
                'channel' => null,
                'basin' => 'Cauto',
                'locality_id' => 1886,
            ],
            [
                'id' => 'UCL13301',
                'location' => 'EAH Granma',
                'latitude' => 20.367717686795707,
                'longitude' => -76.64086927847255,
                'imei' => '862636052186862',
                'phone' => '52865583',
                'channel' => null,
                'basin' => 'Cauto',
                'locality_id' => 1906,
            ],
            [
                'id' => 'UCL13302',
                'location' => 'Derivadora Bayamo',
                'latitude' => 20.31126688,
                'longitude' => -76.63948206,
                'imei' => '862636052186863',
                'phone' => '52865513',
                'channel' => null,
                'basin' => 'Cauto',
                'locality_id' => 1899,
            ],
        ];

        foreach ($equipments as $equipment) {
            if ($equipment['locality_id'] !== null) {
                $locality = Locality::find($equipment['locality_id']);
                if (!$locality) {
                    $this->command->warn('Locality ID ' . $equipment['locality_id'] . ' not found. Skipping equipment ' . $equipment['id']);
                    continue;
                }
            }

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
