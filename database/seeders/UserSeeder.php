<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Role;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $adminRole = Role::find(1);
        $userRole = Role::find(2);

        if ($adminRole) {
            User::firstOrCreate(
                ['username' => 'admin'],
                [
                    'password' => Hash::make('admin'),
                    'role_id' => $adminRole->id,
                ]
            );
        }

        if ($userRole) {
            User::firstOrCreate(
                ['username' => 'user'],
                [
                    'password' => Hash::make('user'),
                    'role_id' => $userRole->id,
                ]
            );
        }
    }
}

