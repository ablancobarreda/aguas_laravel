<?php

namespace Database\Seeders;

use App\Models\Province;
use Illuminate\Database\Seeder;

class ProvinceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $provinces = [
            ['id' => 1, 'name' => 'Pinar del Río'],
            ['id' => 2, 'name' => 'Artemisa'],
            ['id' => 3, 'name' => 'La Habana'],
            ['id' => 4, 'name' => 'Mayabeque'],
            ['id' => 5, 'name' => 'Matanzas'],
            ['id' => 6, 'name' => 'Cienfuegos'],
            ['id' => 7, 'name' => 'Villa Clara'],
            ['id' => 8, 'name' => 'Sancti Spíritus'],
            ['id' => 9, 'name' => 'Ciego de Ávila'],
            ['id' => 10, 'name' => 'Camagüey'],
            ['id' => 11, 'name' => 'Las Tunas'],
            ['id' => 12, 'name' => 'Granma'],
            ['id' => 13, 'name' => 'Holguín'],
            ['id' => 14, 'name' => 'Santiago de Cuba'],
            ['id' => 15, 'name' => 'Guantánamo'],
            ['id' => 16, 'name' => 'Isla de la Juventud'],
        ];

        foreach ($provinces as $province) {
            Province::firstOrCreate(
                ['id' => $province['id']],
                ['name' => $province['name']]
            );
        }
    }
}

