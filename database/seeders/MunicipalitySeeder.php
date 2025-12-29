<?php

namespace Database\Seeders;

use App\Models\Municipality;
use App\Models\Province;
use Illuminate\Database\Seeder;

class MunicipalitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $municipalities = [
            // Pinar del Río (1)
            ['id' => 1, 'name' => 'Pinar del Río', 'province_id' => 1],
            ['id' => 2, 'name' => 'Viñales', 'province_id' => 1],
            ['id' => 3, 'name' => 'Consolación del Sur', 'province_id' => 1],
            
            // Artemisa (2)
            ['id' => 4, 'name' => 'Artemisa', 'province_id' => 2],
            ['id' => 5, 'name' => 'San Antonio de los Baños', 'province_id' => 2],
            ['id' => 6, 'name' => 'Guanajay', 'province_id' => 2],
            
            // La Habana (3)
            ['id' => 7, 'name' => 'Centro Habana', 'province_id' => 3],
            ['id' => 8, 'name' => 'La Habana Vieja', 'province_id' => 3],
            ['id' => 9, 'name' => 'Plaza de la Revolución', 'province_id' => 3],
            ['id' => 10, 'name' => 'Playa', 'province_id' => 3],
            ['id' => 11, 'name' => 'Marianao', 'province_id' => 3],
            
            // Mayabeque (4)
            ['id' => 12, 'name' => 'San José de las Lajas', 'province_id' => 4],
            ['id' => 13, 'name' => 'Batabanó', 'province_id' => 4],
            
            // Matanzas (5)
            ['id' => 14, 'name' => 'Matanzas', 'province_id' => 5],
            ['id' => 15, 'name' => 'Varadero', 'province_id' => 5],
            ['id' => 16, 'name' => 'Cárdenas', 'province_id' => 5],
            
            // Cienfuegos (6)
            ['id' => 17, 'name' => 'Cienfuegos', 'province_id' => 6],
            ['id' => 18, 'name' => 'Palmira', 'province_id' => 6],
            
            // Villa Clara (7)
            ['id' => 19, 'name' => 'Santa Clara', 'province_id' => 7],
            ['id' => 20, 'name' => 'Placetas', 'province_id' => 7],
            
            // Sancti Spíritus (8)
            ['id' => 21, 'name' => 'Sancti Spíritus', 'province_id' => 8],
            ['id' => 22, 'name' => 'Trinidad', 'province_id' => 8],
            
            // Ciego de Ávila (9)
            ['id' => 23, 'name' => 'Ciego de Ávila', 'province_id' => 9],
            ['id' => 24, 'name' => 'Morón', 'province_id' => 9],
            
            // Camagüey (10)
            ['id' => 25, 'name' => 'Camagüey', 'province_id' => 10],
            ['id' => 26, 'name' => 'Florida', 'province_id' => 10],
            
            // Las Tunas (11)
            ['id' => 27, 'name' => 'Las Tunas', 'province_id' => 11],
            ['id' => 28, 'name' => 'Puerto Padre', 'province_id' => 11],
            
            // Granma (12)
            ['id' => 29, 'name' => 'Bayamo', 'province_id' => 12],
            ['id' => 30, 'name' => 'Manzanillo', 'province_id' => 12],
            ['id' => 31, 'name' => 'Jiguaní', 'province_id' => 12],
            
            // Holguín (13)
            ['id' => 32, 'name' => 'Holguín', 'province_id' => 13],
            ['id' => 33, 'name' => 'Banes', 'province_id' => 13],
            
            // Santiago de Cuba (14)
            ['id' => 34, 'name' => 'Santiago de Cuba', 'province_id' => 14],
            ['id' => 35, 'name' => 'Palma Soriano', 'province_id' => 14],
            ['id' => 36, 'name' => 'San Luis', 'province_id' => 14],
            
            // Guantánamo (15)
            ['id' => 37, 'name' => 'Guantánamo', 'province_id' => 15],
            ['id' => 38, 'name' => 'Baracoa', 'province_id' => 15],
            
            // Isla de la Juventud (16)
            ['id' => 39, 'name' => 'Nueva Gerona', 'province_id' => 16],
        ];

        foreach ($municipalities as $municipality) {
            $province = Province::find($municipality['province_id']);
            if ($province) {
                Municipality::firstOrCreate(
                    ['id' => $municipality['id']],
                    [
                        'name' => $municipality['name'],
                        'province_id' => $municipality['province_id'],
                    ]
                );
            }
        }
    }
}

