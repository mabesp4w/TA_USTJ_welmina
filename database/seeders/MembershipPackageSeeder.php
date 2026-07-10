<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MembershipPackageSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('membership_packages')->insert([
            ['package_name' => 'Silver', 'registration_fee' => 150000.00, 'description' => 'Paket Silver'],
            ['package_name' => 'Gold', 'registration_fee' => 200000.00, 'description' => 'Paket Gold'],
            ['package_name' => 'Platinum', 'registration_fee' => 300000.00, 'description' => 'Paket Platinum'],
        ]);

        $packages = DB::table('membership_packages')->pluck('package_name', 'id');

        $prices = [
            ['duration_months' => 1, 'prices' => ['Silver' => 250000.00, 'Gold' => 350000.00, 'Platinum' => 500000.00]],
            ['duration_months' => 3, 'prices' => ['Silver' => 700000.00, 'Gold' => 950000.00, 'Platinum' => 1350000.00]],
            ['duration_months' => 6, 'prices' => ['Silver' => 1750000.00, 'Gold' => 2400000.00, 'Platinum' => 3250000.00]],
        ];

        $records = [];
        foreach ($prices as $entry) {
            foreach ($packages as $id => $name) {
                $records[] = [
                    'package_id' => $id,
                    'duration_months' => $entry['duration_months'],
                    'price' => $entry['prices'][$name],
                ];
            }
        }

        DB::table('membership_package_prices')->insert($records);
    }
}
