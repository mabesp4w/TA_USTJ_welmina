<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class InventoryItemSeeder extends Seeder
{
    public function run(): void
    {
        $conditions = ['baik', 'perlu_perawatan', 'rusak'];
        $statuses = ['aktif', 'tidak_aktif'];

        $items = [
            ['item_code' => 'KRD-001', 'item_name' => 'Treadmill Elektrik', 'category_id' => 1, 'stock' => 5, 'location_name' => 'Ruang Kardio A'],
            ['item_code' => 'KRD-002', 'item_name' => 'Sepeda Statis Magnetik', 'category_id' => 1, 'stock' => 8, 'location_name' => 'Ruang Kardio A'],
            ['item_code' => 'KRD-003', 'item_name' => 'Elliptical Trainer', 'category_id' => 1, 'stock' => 4, 'location_name' => 'Ruang Kardio A'],
            ['item_code' => 'KRD-004', 'item_name' => 'Mesin Dayung', 'category_id' => 1, 'stock' => 3, 'location_name' => 'Ruang Kardio B'],
            ['item_code' => 'KRD-005', 'item_name' => 'Stair Climber', 'category_id' => 1, 'stock' => 2, 'location_name' => 'Ruang Kardio B'],
            ['item_code' => 'BB-001', 'item_name' => 'Dumbbell Set 1-10kg', 'category_id' => 2, 'stock' => 10, 'location_name' => 'Ruang Beban Bebas'],
            ['item_code' => 'BB-002', 'item_name' => 'Dumbbell Set 12-20kg', 'category_id' => 2, 'stock' => 8, 'location_name' => 'Ruang Beban Bebas'],
            ['item_code' => 'BB-003', 'item_name' => 'Barbell Olimpiade', 'category_id' => 2, 'stock' => 6, 'location_name' => 'Ruang Beban Bebas'],
            ['item_code' => 'BB-004', 'item_name' => 'Kettlebell 8-24kg', 'category_id' => 2, 'stock' => 12, 'location_name' => 'Ruang Beban Bebas'],
            ['item_code' => 'BB-005', 'item_name' => 'Plate Beban 2.5-25kg', 'category_id' => 2, 'stock' => 20, 'location_name' => 'Ruang Beban Bebas'],
            ['item_code' => 'MSN-001', 'item_name' => 'Leg Press Machine', 'category_id' => 3, 'stock' => 3, 'location_name' => 'Ruang Mesin'],
            ['item_code' => 'MSN-002', 'item_name' => 'Chest Press Machine', 'category_id' => 3, 'stock' => 4, 'location_name' => 'Ruang Mesin'],
            ['item_code' => 'MSN-003', 'item_name' => 'Lat Pulldown Machine', 'category_id' => 3, 'stock' => 3, 'location_name' => 'Ruang Mesin'],
            ['item_code' => 'MSN-004', 'item_name' => 'Shoulder Press Machine', 'category_id' => 3, 'stock' => 2, 'location_name' => 'Ruang Mesin'],
            ['item_code' => 'MSN-005', 'item_name' => 'Cable Crossover', 'category_id' => 3, 'stock' => 2, 'location_name' => 'Ruang Mesin'],
            ['item_code' => 'YOG-001', 'item_name' => 'Matras Yoga Premium', 'category_id' => 4, 'stock' => 25, 'location_name' => 'Studio Yoga'],
            ['item_code' => 'YOG-002', 'item_name' => 'Bola Yoga 65cm', 'category_id' => 4, 'stock' => 15, 'location_name' => 'Studio Yoga'],
            ['item_code' => 'YOG-003', 'item_name' => 'Yoga Strap', 'category_id' => 4, 'stock' => 20, 'location_name' => 'Studio Yoga'],
            ['item_code' => 'FNG-001', 'item_name' => 'TRX Suspension Trainer', 'category_id' => 5, 'stock' => 10, 'location_name' => 'Ruang Fungsional'],
            ['item_code' => 'FNG-002', 'item_name' => 'Battle Rope 15m', 'category_id' => 5, 'stock' => 4, 'location_name' => 'Ruang Fungsional'],
            ['item_code' => 'FNG-003', 'item_name' => 'Medicine Ball 3-10kg', 'category_id' => 5, 'stock' => 15, 'location_name' => 'Ruang Fungsional'],
            ['item_code' => 'REG-001', 'item_name' => 'Foam Roller Besar', 'category_id' => 6, 'stock' => 10, 'location_name' => 'Ruang Peregangan'],
            ['item_code' => 'REG-002', 'item_name' => 'Massage Ball Set', 'category_id' => 6, 'stock' => 15, 'location_name' => 'Ruang Peregangan'],
            ['item_code' => 'LK-001', 'item_name' => 'Interlocking Floor Mat', 'category_id' => 8, 'stock' => 100, 'location_name' => 'Gudang'],
            ['item_code' => 'BERSIH-001', 'item_name' => 'Disinfektan Sprayer', 'category_id' => 10, 'stock' => 8, 'location_name' => 'Gudang'],
        ];

        foreach ($items as $i) {
            DB::table('inventory_items')->insert([
                'item_code' => $i['item_code'],
                'item_name' => $i['item_name'],
                'category_id' => $i['category_id'],
                'stock' => $i['stock'],
                'item_condition' => $conditions[array_rand($conditions)],
                'item_status' => $statuses[array_rand($statuses)],
                'location_name' => $i['location_name'],
                'supplier_id' => rand(1, 20),
                'notes' => null,
                'last_service_date' => now()->subDays(rand(30, 365))->toDateString(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
