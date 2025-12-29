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
            // Equipment: UCL13300
            ['equipment_id' => 'UCL13300', 'channel_id' => 2],
            ['equipment_id' => 'UCL13300', 'channel_id' => 7],
            ['equipment_id' => 'UCL13300', 'channel_id' => 6],
            ['equipment_id' => 'UCL13300', 'channel_id' => 1],
            ['equipment_id' => 'UCL13300', 'channel_id' => 8],
            // Equipment: UCL13302
            ['equipment_id' => 'UCL13302', 'channel_id' => 1],
            ['equipment_id' => 'UCL13302', 'channel_id' => 2],
            ['equipment_id' => 'UCL13302', 'channel_id' => 6],
            ['equipment_id' => 'UCL13302', 'channel_id' => 7],
            ['equipment_id' => 'UCL13302', 'channel_id' => 8],
            // Equipment: UCL13301
            ['equipment_id' => 'UCL13301', 'channel_id' => 1],
            ['equipment_id' => 'UCL13301', 'channel_id' => 2],
            ['equipment_id' => 'UCL13301', 'channel_id' => 6],
            ['equipment_id' => 'UCL13301', 'channel_id' => 8],
            ['equipment_id' => 'UCL13301', 'channel_id' => 7],
        ];

        foreach ($equipmentChannels as $equipmentChannel) {
            $equipment = Equipment::find($equipmentChannel['equipment_id']);
            $channel = Channel::find($equipmentChannel['channel_id']);
            
            if ($equipment && $channel) {
                // Verificar si la relación ya existe antes de agregarla
                if (!$equipment->channels()->where('channels.id', $channel->id)->exists()) {
                    $equipment->channels()->attach($channel->id);
                }
            } else {
                if (!$equipment) {
                    $this->command->warn('Equipment ' . $equipmentChannel['equipment_id'] . ' not found.');
                }
                if (!$channel) {
                    $this->command->warn('Channel ' . $equipmentChannel['channel_id'] . ' not found.');
                }
            }
        }
    }
}
