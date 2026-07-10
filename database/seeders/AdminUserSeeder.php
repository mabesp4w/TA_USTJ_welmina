<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'id' => 1,
            'full_name' => 'Administrator',
            'username' => 'admin',
            'email' => 'admin@fitness.test',
            'password_hash' => bcrypt('12345'),
            'role' => 'administrator',
            'is_active' => true,
        ]);
    }
}
