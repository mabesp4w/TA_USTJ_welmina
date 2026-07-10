<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class InventoryCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['category_name' => 'Alat Kardio', 'description' => 'Peralatan kardio seperti treadmill, sepeda statis, elliptical'],
            ['category_name' => 'Alat Beban Bebas', 'description' => 'Dumbbell, barbell, kettlebell, dan plate'],
            ['category_name' => 'Mesin Beban', 'description' => 'Mesin latihan terintegrasi seperti leg press, chest press'],
            ['category_name' => 'Alat Yoga & Pilates', 'description' => 'Matras, bola yoga, strap, dan aksesoris pilates'],
            ['category_name' => 'Alat Fungsional', 'description' => 'TRX, battle rope, medicine ball, resistance band'],
            ['category_name' => 'Alat Peregangan', 'description' => 'Foam roller, stretching mat, massage ball'],
            ['category_name' => 'Perlengkapan Renang', 'description' => 'Alat bantu renang, kickboard, pull buoy'],
            ['category_name' => 'Perlengkapan Lantai', 'description' => 'Flooring, matras lantai, tile karet'],
            ['category_name' => 'Alat Ukur & Timbangan', 'description' => 'Timbangan badan, alat ukur lemak, tinggi badan'],
            ['category_name' => 'Perlengkapan Kebersihan', 'description' => 'Alat pembersih, disinfektan, lap, dan perlengkapan kebersihan'],
        ];

        DB::table('inventory_categories')->insert($categories);
    }
}
