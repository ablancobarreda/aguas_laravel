<?php

namespace Database\Seeders;

use App\Models\Locality;
use App\Models\Municipality;
use Illuminate\Database\Seeder;

class LocalitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $localities = [
            // Pinar del Río - Pinar del Río (1)
            ['id' => 1, 'name' => 'Centro', 'municipality_id' => 1],
            ['id' => 2, 'name' => 'La Conchita', 'municipality_id' => 1],
            
            // Pinar del Río - Viñales (2)
            ['id' => 3, 'name' => 'Viñales', 'municipality_id' => 2],
            ['id' => 4, 'name' => 'Dos Hermanas', 'municipality_id' => 2],
            
            // La Habana - Centro Habana (7)
            ['id' => 5, 'name' => 'Chinatown', 'municipality_id' => 7],
            ['id' => 6, 'name' => 'Malecón', 'municipality_id' => 7],
            
            // La Habana - Plaza de la Revolución (9)
            ['id' => 7, 'name' => 'Vedado', 'municipality_id' => 9],
            ['id' => 8, 'name' => 'Centro', 'municipality_id' => 9],
            
            // La Habana - Playa (10)
            ['id' => 9, 'name' => 'Miramar', 'municipality_id' => 10],
            ['id' => 10, 'name' => 'Siboney', 'municipality_id' => 10],
            
            // Granma - Bayamo (29)
            ['id' => 11, 'name' => 'Centro', 'municipality_id' => 29],
            ['id' => 12, 'name' => 'Datil', 'municipality_id' => 29],
            
            // Granma - Manzanillo (30)
            ['id' => 13, 'name' => 'Costa', 'municipality_id' => 30],
            ['id' => 14, 'name' => 'Puerto', 'municipality_id' => 30],
            
            // Santiago de Cuba - Santiago de Cuba (34)
            ['id' => 15, 'name' => 'Vista Alegre', 'municipality_id' => 34],
            ['id' => 16, 'name' => 'Centro', 'municipality_id' => 34],
            
            // Santiago de Cuba - Palma Soriano (35)
            ['id' => 17, 'name' => 'Central', 'municipality_id' => 35],
            ['id' => 18, 'name' => 'Periferia', 'municipality_id' => 35],
        ];

        foreach ($localities as $locality) {
            $municipality = Municipality::find($locality['municipality_id']);
            if ($municipality) {
                Locality::firstOrCreate(
                    ['id' => $locality['id']],
                    [
                        'name' => $locality['name'],
                        'municipality_id' => $locality['municipality_id'],
                    ]
                );
            }
        }
    }
}

