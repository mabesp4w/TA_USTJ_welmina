<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            // Pengelola
            ['full_name' => 'Budi Santoso', 'username' => 'budi', 'email' => 'budi@fitness.test', 'role' => 'pengelola'],
            ['full_name' => 'Siti Rahayu', 'username' => 'siti', 'email' => 'siti@fitness.test', 'role' => 'pengelola'],
            ['full_name' => 'Agus Wijaya', 'username' => 'agus', 'email' => 'agus@fitness.test', 'role' => 'pengelola'],
            ['full_name' => 'Dewi Sartika', 'username' => 'dewi', 'email' => 'dewi@fitness.test', 'role' => 'pengelola'],
            ['full_name' => 'Hendra Gunawan', 'username' => 'hendra', 'email' => 'hendra@fitness.test', 'role' => 'pengelola'],
            // Pimpinan
            ['full_name' => 'Prof. Dr. Hasanuddin', 'username' => 'hasanuddin', 'email' => 'hasanuddin@fitness.test', 'role' => 'pimpinan'],
            ['full_name' => 'Dr. Ratna Dewi', 'username' => 'ratna', 'email' => 'ratna@fitness.test', 'role' => 'pimpinan'],
            // Staff
            ['full_name' => 'Ahmad Fauzi', 'username' => 'ahmad', 'email' => 'ahmad@fitness.test', 'role' => 'staff'],
            ['full_name' => 'Rina Marlina', 'username' => 'rina', 'email' => 'rina@fitness.test', 'role' => 'staff'],
            ['full_name' => 'Doni Prasetyo', 'username' => 'doni', 'email' => 'doni@fitness.test', 'role' => 'staff'],
            ['full_name' => 'Mega Wati', 'username' => 'mega', 'email' => 'mega@fitness.test', 'role' => 'staff'],
            ['full_name' => 'Rudi Hartono', 'username' => 'rudi', 'email' => 'rudi@fitness.test', 'role' => 'staff'],
            ['full_name' => 'Fitri Handayani', 'username' => 'fitri', 'email' => 'fitri@fitness.test', 'role' => 'staff'],
            ['full_name' => 'Yoga Pratama', 'username' => 'yoga', 'email' => 'yoga@fitness.test', 'role' => 'staff'],
            ['full_name' => 'Nina Suryani', 'username' => 'nina', 'email' => 'nina@fitness.test', 'role' => 'staff'],
            ['full_name' => 'Eko Saputra', 'username' => 'eko', 'email' => 'eko@fitness.test', 'role' => 'staff'],
            ['full_name' => 'Lilis Marlina', 'username' => 'lilis', 'email' => 'lilis@fitness.test', 'role' => 'staff'],
            ['full_name' => 'Adi Nugroho', 'username' => 'adi', 'email' => 'adi@fitness.test', 'role' => 'staff'],
            ['full_name' => 'Desi Ratnasari', 'username' => 'desi', 'email' => 'desi@fitness.test', 'role' => 'staff'],
            ['full_name' => 'Irfan Hakim', 'username' => 'irfan', 'email' => 'irfan@fitness.test', 'role' => 'staff'],
            ['full_name' => 'Sari Puspita', 'username' => 'sari', 'email' => 'sari@fitness.test', 'role' => 'staff'],
            ['full_name' => 'Bayu Aji', 'username' => 'bayu', 'email' => 'bayu@fitness.test', 'role' => 'staff'],
        ];

        foreach ($users as $u) {
            User::create([
                'full_name' => $u['full_name'],
                'username' => $u['username'],
                'email' => $u['email'],
                'password_hash' => bcrypt('12345'),
                'role' => $u['role'],
                'is_active' => true,
            ]);
        }
    }
}
