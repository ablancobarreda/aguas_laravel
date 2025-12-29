<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            UserSeeder::class,
            ProvinceSeeder::class,
            MunicipalitySeeder::class,
            LocalitySeeder::class,
            ChannelSeeder::class,
            EquipmentSeeder::class,
            EquipmentChannelSeeder::class,
        ]);
    }
}
