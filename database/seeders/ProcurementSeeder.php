<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProcurementSeeder extends Seeder
{
    public function run(): void
    {
        // Procurements (25 records)
        $notes = [
            'Pembelian rutin bulanan',
            'Pengadaan kebutuhan baru',
            'Penggantian alat rusak',
            'Penambahan stok',
            'Pembelian untuk event',
        ];

        $procurements = [];
        for ($i = 1; $i <= 25; $i++) {
            $qty = rand(1, 10);
            $unitPrice = rand(50000, 2000000);
            $procurements[] = [
                'procurement_code' => 'PO-'.str_pad($i, 4, '0', STR_PAD_LEFT),
                'item_id' => rand(1, 25),
                'supplier_id' => rand(1, 20),
                'quantity' => $qty,
                'unit_price' => $unitPrice,
                'total_price' => $qty * $unitPrice,
                'procurement_date' => now()->subDays(rand(0, 365))->toDateString(),
                'notes' => $notes[array_rand($notes)],
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        DB::table('procurements')->insert($procurements);

        // Procurement Requests (25 records)
        $statuses = ['pending', 'disetujui', 'ditolak', 'selesai'];
        $itemNames = [
            'Treadmill Baru', 'Dumbbell Set', 'Matras Yoga', 'Resistance Band',
            'Kettlebell', 'Barbell Set', 'Sepeda Statis', 'TRX Set',
            'Medicine Ball', 'Bola Yoga', 'Foam Roller', 'Battle Rope',
            'Leg Press Machine', 'Chest Press', 'Cable Crossover', 'Elliptical',
            'Mesin Dayung', 'Shoulder Press', 'Lat Pulldown', 'Stair Climber',
        ];

        $requests = [];
        for ($i = 1; $i <= 25; $i++) {
            $qty = rand(1, 15);
            $unitPrice = rand(100000, 3000000);
            $status = $statuses[array_rand($statuses)];
            $requests[] = [
                'request_no' => 'RQ-'.str_pad($i, 4, '0', STR_PAD_LEFT),
                'item_name' => $itemNames[array_rand($itemNames)],
                'category_id' => rand(1, 10),
                'quantity' => $qty,
                'estimated_price' => $qty * $unitPrice,
                'supplier_id' => rand(1, 20),
                'required_date' => now()->addDays(rand(7, 90))->toDateString(),
                'description' => 'Permintaan pengadaan no. '.$i,
                'request_status' => $status,
                'requested_by' => rand(2, 23),
                'approved_by' => $status !== 'pending' ? rand(2, 7) : null,
                'approved_at' => $status !== 'pending' ? now()->subDays(rand(0, 30)) : null,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        DB::table('procurement_requests')->insert($requests);
    }
}
