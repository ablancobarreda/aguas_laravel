<?php

namespace Database\Seeders;

use App\Models\Equipment;
use App\Models\Channel;
use Illuminate\Database\Seeder;

class EquipmentChannelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $equipmentChannels = [
            // EST001 - Asociar con Nivel, Temperatura y Conductividad
            ['equipment_id' => 'EST001', 'channel_id' => 1], // Nivel
            ['equipment_id' => 'EST001', 'channel_id' => 2], // Temperatura
            ['equipment_id' => 'EST001', 'channel_id' => 3], // Conductividad
            
            // EST002 - Asociar con Nivel, pH y Oxígeno Disuelto
            ['equipment_id' => 'EST002', 'channel_id' => 1], // Nivel
            ['equipment_id' => 'EST002', 'channel_id' => 5], // pH
            ['equipment_id' => 'EST002', 'channel_id' => 6], // Oxígeno Disuelto
            
            // EST003 - Asociar con Nivel Acuífero, Temperatura y Conductividad
            ['equipment_id' => 'EST003', 'channel_id' => 4], // Nivel Acuífero
            ['equipment_id' => 'EST003', 'channel_id' => 2], // Temperatura
            ['equipment_id' => 'EST003', 'channel_id' => 3], // Conductividad
            
            // EST004 - Asociar con Nivel, Temperatura, pH y Turbidez
            ['equipment_id' => 'EST004', 'channel_id' => 1], // Nivel
            ['equipment_id' => 'EST004', 'channel_id' => 2], // Temperatura
            ['equipment_id' => 'EST004', 'channel_id' => 5], // pH
            ['equipment_id' => 'EST004', 'channel_id' => 7], // Turbidez
            
            // EST005 - Asociar con Nivel, Caudal y Conductividad
            ['equipment_id' => 'EST005', 'channel_id' => 1], // Nivel
            ['equipment_id' => 'EST005', 'channel_id' => 8], // Caudal
            ['equipment_id' => 'EST005', 'channel_id' => 3], // Conductividad
        ];

        foreach ($equipmentChannels as $equipmentChannel) {
            $equipment = Equipment::find($equipmentChannel['equipment_id']);
            $channel = Channel::find($equipmentChannel['channel_id']);
            
            if ($equipment && $channel) {
                // Verificar si la relación ya existe antes de agregarla
                if (!$equipment->channels()->where('channels.id', $channel->id)->exists()) {
                    $equipment->channels()->attach($channel->id);
                }
            }
        }
    }
}

