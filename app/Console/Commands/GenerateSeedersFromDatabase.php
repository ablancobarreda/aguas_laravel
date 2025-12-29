<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class GenerateSeedersFromDatabase extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'db:generate-seeders 
                            {--channels : Generate ChannelSeeder}
                            {--equipment : Generate EquipmentSeeder}
                            {--equipment-channels : Generate EquipmentChannelSeeder}
                            {--all : Generate all seeders}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate seeders from existing database data';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $generateAll = $this->option('all');
        $generateChannels = $this->option('channels') || $generateAll;
        $generateEquipment = $this->option('equipment') || $generateAll;
        $generateEquipmentChannels = $this->option('equipment-channels') || $generateAll;

        if (!$generateChannels && !$generateEquipment && !$generateEquipmentChannels) {
            $this->error('You must specify at least one seeder to generate.');
            $this->info('Use --channels, --equipment, --equipment-channels, or --all');
            return 1;
        }

        if ($generateChannels) {
            $this->generateChannelSeeder();
        }

        if ($generateEquipment) {
            $this->generateEquipmentSeeder();
        }

        if ($generateEquipmentChannels) {
            $this->generateEquipmentChannelSeeder();
        }

        $this->info('✅ Seeders generated successfully!');
        return 0;
    }

    /**
     * Generate ChannelSeeder from database
     */
    protected function generateChannelSeeder()
    {
        $this->info('📊 Extracting channels from database...');
        
        $channels = DB::table('channels')->get();
        
        if ($channels->isEmpty()) {
            $this->warn('⚠️  No channels found in database.');
            return;
        }

        $this->info("Found {$channels->count()} channels.");

        $seederContent = "<?php\n\n";
        $seederContent .= "namespace Database\\Seeders;\n\n";
        $seederContent .= "use App\\Models\\Channel;\n";
        $seederContent .= "use Illuminate\\Database\\Seeder;\n\n";
        $seederContent .= "class ChannelSeeder extends Seeder\n";
        $seederContent .= "{\n";
        $seederContent .= "    /**\n";
        $seederContent .= "     * Run the database seeds.\n";
        $seederContent .= "     */\n";
        $seederContent .= "    public function run(): void\n";
        $seederContent .= "    {\n";
        $seederContent .= "        \$channels = [\n";

        foreach ($channels as $channel) {
            $seederContent .= "            [\n";
            $seederContent .= "                'id' => {$channel->id},\n";
            $seederContent .= "                'name' => " . $this->formatString($channel->name) . ",\n";
            $seederContent .= "                'col_rel' => " . $this->formatString($channel->col_rel) . ",\n";
            $seederContent .= "                'variable' => " . $this->formatString($channel->variable ?? '') . ",\n";
            $seederContent .= "                'unidad_medida' => " . $this->formatString($channel->unidad_medida ?? '') . ",\n";
            $seederContent .= "                'es_acuifero' => " . ($channel->es_acuifero ? 'true' : 'false') . ",\n";
            $seederContent .= "            ],\n";
        }

        $seederContent .= "        ];\n\n";
        $seederContent .= "        foreach (\$channels as \$channel) {\n";
        $seederContent .= "            Channel::firstOrCreate(\n";
        $seederContent .= "                ['id' => \$channel['id']],\n";
        $seederContent .= "                [\n";
        $seederContent .= "                    'name' => \$channel['name'],\n";
        $seederContent .= "                    'col_rel' => \$channel['col_rel'],\n";
        $seederContent .= "                    'variable' => \$channel['variable'],\n";
        $seederContent .= "                    'unidad_medida' => \$channel['unidad_medida'],\n";
        $seederContent .= "                    'es_acuifero' => \$channel['es_acuifero'],\n";
        $seederContent .= "                ]\n";
        $seederContent .= "            );\n";
        $seederContent .= "        }\n";
        $seederContent .= "    }\n";
        $seederContent .= "}\n";

        $seederPath = database_path('seeders/ChannelSeeder.php');
        File::put($seederPath, $seederContent);
        
        $this->info("✅ ChannelSeeder generated: {$seederPath}");
    }

    /**
     * Generate EquipmentSeeder from database
     */
    protected function generateEquipmentSeeder()
    {
        $this->info('📊 Extracting equipment from database...');
        
        $equipment = DB::table('equipment')->get();
        
        if ($equipment->isEmpty()) {
            $this->warn('⚠️  No equipment found in database.');
            return;
        }

        $this->info("Found {$equipment->count()} equipment records.");

        $seederContent = "<?php\n\n";
        $seederContent .= "namespace Database\\Seeders;\n\n";
        $seederContent .= "use App\\Models\\Equipment;\n";
        $seederContent .= "use App\\Models\\Locality;\n";
        $seederContent .= "use Illuminate\\Database\\Seeder;\n\n";
        $seederContent .= "class EquipmentSeeder extends Seeder\n";
        $seederContent .= "{\n";
        $seederContent .= "    /**\n";
        $seederContent .= "     * Run the database seeds.\n";
        $seederContent .= "     */\n";
        $seederContent .= "    public function run(): void\n";
        $seederContent .= "    {\n";
        $seederContent .= "        \$equipments = [\n";

        foreach ($equipment as $eq) {
            $seederContent .= "            [\n";
            $seederContent .= "                'id' => " . $this->formatString($eq->id) . ",\n";
            $seederContent .= "                'location' => " . $this->formatString($eq->location) . ",\n";
            $seederContent .= "                'latitude' => " . ($eq->latitude ?? null ?: 'null') . ",\n";
            $seederContent .= "                'longitude' => " . ($eq->longitude ?? null ?: 'null') . ",\n";
            $seederContent .= "                'imei' => " . $this->formatString($eq->imei ?? '') . ",\n";
            $seederContent .= "                'phone' => " . $this->formatString($eq->phone ?? '') . ",\n";
            $seederContent .= "                'channel' => " . $this->formatString($eq->channel ?? null) . ",\n";
            $seederContent .= "                'basin' => " . $this->formatString($eq->basin ?? null) . ",\n";
            $seederContent .= "                'locality_id' => " . ($eq->locality_id ?? null ?: 'null') . ",\n";
            $seederContent .= "            ],\n";
        }

        $seederContent .= "        ];\n\n";
        $seederContent .= "        foreach (\$equipments as \$equipment) {\n";
        $seederContent .= "            if (\$equipment['locality_id'] !== null) {\n";
        $seederContent .= "                \$locality = Locality::find(\$equipment['locality_id']);\n";
        $seederContent .= "                if (!\$locality) {\n";
        $seederContent .= "                    \$this->command->warn('Locality ID ' . \$equipment['locality_id'] . ' not found. Skipping equipment ' . \$equipment['id']);\n";
        $seederContent .= "                    continue;\n";
        $seederContent .= "                }\n";
        $seederContent .= "            }\n";
        $seederContent .= "            \n";
        $seederContent .= "            Equipment::firstOrCreate(\n";
        $seederContent .= "                ['id' => \$equipment['id']],\n";
        $seederContent .= "                [\n";
        $seederContent .= "                    'location' => \$equipment['location'],\n";
        $seederContent .= "                    'latitude' => \$equipment['latitude'],\n";
        $seederContent .= "                    'longitude' => \$equipment['longitude'],\n";
        $seederContent .= "                    'imei' => \$equipment['imei'],\n";
        $seederContent .= "                    'phone' => \$equipment['phone'],\n";
        $seederContent .= "                    'channel' => \$equipment['channel'],\n";
        $seederContent .= "                    'basin' => \$equipment['basin'],\n";
        $seederContent .= "                    'locality_id' => \$equipment['locality_id'],\n";
        $seederContent .= "                ]\n";
        $seederContent .= "            );\n";
        $seederContent .= "        }\n";
        $seederContent .= "    }\n";
        $seederContent .= "}\n";

        $seederPath = database_path('seeders/EquipmentSeeder.php');
        File::put($seederPath, $seederContent);
        
        $this->info("✅ EquipmentSeeder generated: {$seederPath}");
    }

    /**
     * Generate EquipmentChannelSeeder from database
     */
    protected function generateEquipmentChannelSeeder()
    {
        $this->info('📊 Extracting equipment_channels relationships from database...');
        
        $equipmentChannels = DB::table('equipment_channels')->get();
        
        if ($equipmentChannels->isEmpty()) {
            $this->warn('⚠️  No equipment_channels relationships found in database.');
            return;
        }

        $this->info("Found {$equipmentChannels->count()} equipment-channel relationships.");

        $seederContent = "<?php\n\n";
        $seederContent .= "namespace Database\\Seeders;\n\n";
        $seederContent .= "use App\\Models\\Equipment;\n";
        $seederContent .= "use App\\Models\\Channel;\n";
        $seederContent .= "use Illuminate\\Database\\Seeder;\n\n";
        $seederContent .= "class EquipmentChannelSeeder extends Seeder\n";
        $seederContent .= "{\n";
        $seederContent .= "    /**\n";
        $seederContent .= "     * Run the database seeds.\n";
        $seederContent .= "     */\n";
        $seederContent .= "    public function run(): void\n";
        $seederContent .= "    {\n";
        $seederContent .= "        \$equipmentChannels = [\n";

        // Group by equipment_id for better readability
        $grouped = $equipmentChannels->groupBy('equipment_id');
        
        foreach ($grouped as $equipmentId => $channels) {
            $seederContent .= "            // Equipment: {$equipmentId}\n";
            foreach ($channels as $ec) {
                $seederContent .= "            ['equipment_id' => " . $this->formatString($ec->equipment_id) . ", 'channel_id' => {$ec->channel_id}],\n";
            }
        }

        $seederContent .= "        ];\n\n";
        $seederContent .= "        foreach (\$equipmentChannels as \$equipmentChannel) {\n";
        $seederContent .= "            \$equipment = Equipment::find(\$equipmentChannel['equipment_id']);\n";
        $seederContent .= "            \$channel = Channel::find(\$equipmentChannel['channel_id']);\n";
        $seederContent .= "            \n";
        $seederContent .= "            if (\$equipment && \$channel) {\n";
        $seederContent .= "                // Verificar si la relación ya existe antes de agregarla\n";
        $seederContent .= "                if (!\$equipment->channels()->where('channels.id', \$channel->id)->exists()) {\n";
        $seederContent .= "                    \$equipment->channels()->attach(\$channel->id);\n";
        $seederContent .= "                }\n";
        $seederContent .= "            } else {\n";
        $seederContent .= "                if (!\$equipment) {\n";
        $seederContent .= "                    \$this->command->warn('Equipment ' . \$equipmentChannel['equipment_id'] . ' not found.');\n";
        $seederContent .= "                }\n";
        $seederContent .= "                if (!\$channel) {\n";
        $seederContent .= "                    \$this->command->warn('Channel ' . \$equipmentChannel['channel_id'] . ' not found.');\n";
        $seederContent .= "                }\n";
        $seederContent .= "            }\n";
        $seederContent .= "        }\n";
        $seederContent .= "    }\n";
        $seederContent .= "}\n";

        $seederPath = database_path('seeders/EquipmentChannelSeeder.php');
        File::put($seederPath, $seederContent);
        
        $this->info("✅ EquipmentChannelSeeder generated: {$seederPath}");
    }

    /**
     * Format string for PHP code
     */
    protected function formatString($value)
    {
        if ($value === null || $value === '') {
            return 'null';
        }
        
        return "'" . addslashes($value) . "'";
    }
}
