<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MemberSeeder extends Seeder
{
    public function run(): void
    {
        $members = [
            ['full_name' => 'Andi Pratama', 'gender' => 'L', 'phone' => '081234567890', 'identity_no' => '3201010101990001'],
            ['full_name' => 'Bunga Citra', 'gender' => 'P', 'phone' => '081234567891', 'identity_no' => '3201010102990002'],
            ['full_name' => 'Cahyo Nugroho', 'gender' => 'L', 'phone' => '081234567892', 'identity_no' => '3201010103990003'],
            ['full_name' => 'Dian Permata', 'gender' => 'P', 'phone' => '081234567893', 'identity_no' => '3201010104990004'],
            ['full_name' => 'Eko Wahyudi', 'gender' => 'L', 'phone' => '081234567894', 'identity_no' => '3201010105990005'],
            ['full_name' => 'Fitriani', 'gender' => 'P', 'phone' => '081234567895', 'identity_no' => '3201010106990006'],
            ['full_name' => 'Gilang Ramadan', 'gender' => 'L', 'phone' => '081234567896', 'identity_no' => '3201010107990007'],
            ['full_name' => 'Hesty Nurul', 'gender' => 'P', 'phone' => '081234567897', 'identity_no' => '3201010108990008'],
            ['full_name' => 'Irfan Maulana', 'gender' => 'L', 'phone' => '081234567898', 'identity_no' => '3201010109990009'],
            ['full_name' => 'Jihan Fadhila', 'gender' => 'P', 'phone' => '081234567899', 'identity_no' => '3201010110990010'],
            ['full_name' => 'Krisna Aditya', 'gender' => 'L', 'phone' => '081234567800', 'identity_no' => '3201010111990011'],
            ['full_name' => 'Laras Ayu', 'gender' => 'P', 'phone' => '081234567801', 'identity_no' => '3201010112990012'],
            ['full_name' => 'Miftahul Huda', 'gender' => 'L', 'phone' => '081234567802', 'identity_no' => '3201010113990013'],
            ['full_name' => 'Nadia Safira', 'gender' => 'P', 'phone' => '081234567803', 'identity_no' => '3201010114990014'],
            ['full_name' => 'Oscar Wirawan', 'gender' => 'L', 'phone' => '081234567804', 'identity_no' => '3201010115990015'],
            ['full_name' => 'Putri Ayunda', 'gender' => 'P', 'phone' => '081234567805', 'identity_no' => '3201010116990016'],
            ['full_name' => 'Qori Amalia', 'gender' => 'P', 'phone' => '081234567806', 'identity_no' => '3201010117990017'],
            ['full_name' => 'Rizky Fauzan', 'gender' => 'L', 'phone' => '081234567807', 'identity_no' => '3201010118990018'],
            ['full_name' => 'Siska Melati', 'gender' => 'P', 'phone' => '081234567808', 'identity_no' => '3201010119990019'],
            ['full_name' => 'Teguh Santoso', 'gender' => 'L', 'phone' => '081234567809', 'identity_no' => '3201010120990020'],
            ['full_name' => 'Umar Faruq', 'gender' => 'L', 'phone' => '081234567810', 'identity_no' => '3201010121990021'],
            ['full_name' => 'Vina Marlina', 'gender' => 'P', 'phone' => '081234567811', 'identity_no' => '3201010122990022'],
            ['full_name' => 'Wawan Setiawan', 'gender' => 'L', 'phone' => '081234567812', 'identity_no' => '3201010123990023'],
            ['full_name' => 'Xena Aulia', 'gender' => 'P', 'phone' => '081234567813', 'identity_no' => '3201010124990024'],
            ['full_name' => 'Yudi Hermawan', 'gender' => 'L', 'phone' => '081234567814', 'identity_no' => '3201010125990025'],
        ];

        $statuses = ['aktif', 'non_aktif', 'pending'];
        $creatorIds = range(2, 23);

        foreach ($members as $i => $m) {
            DB::table('members')->insert([
                'member_code' => 'MBR-'.str_pad($i + 1, 4, '0', STR_PAD_LEFT),
                'full_name' => $m['full_name'],
                'identity_no' => $m['identity_no'],
                'gender' => $m['gender'],
                'birth_date' => now()->subYears(rand(18, 55))->subDays(rand(0, 365))->toDateString(),
                'phone' => $m['phone'],
                'email' => strtolower(str_replace(' ', '', $m['full_name'])).'@email.com',
                'address' => 'Jl. Contoh No. '.($i + 1).', Jakarta',
                'member_status' => $statuses[array_rand($statuses)],
                'joined_at' => now()->subDays(rand(0, 730)),
                'created_by' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
