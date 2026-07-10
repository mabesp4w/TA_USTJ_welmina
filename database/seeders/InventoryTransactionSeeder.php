<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class InventoryTransactionSeeder extends Seeder
{
    public function run(): void
    {
        $maintenanceTypes = ['ringan', 'sedang', 'berat'];
        $resultConditions = ['baik', 'perlu_perawatan', 'rusak'];
        $loanStatuses = ['dipinjam', 'dikembalikan', 'terlambat'];
        $performerNames = ['Teknisi A', 'Teknisi B', 'Teknisi C', 'Eksternal - PT Service'];
        $borrowerNames = ['Andi', 'Budi', 'Citra', 'Dewi', 'Eko', 'Fitri', 'Gilang', 'Hana', 'Irfan', 'Joko'];
        $userIds = range(1, 23);

        // Maintenance Logs (25 records)
        $maintenanceLogs = [];
        for ($i = 1; $i <= 25; $i++) {
            $maintenanceLogs[] = [
                'inventory_item_id' => rand(1, 25),
                'maintenance_type' => $maintenanceTypes[array_rand($maintenanceTypes)],
                'maintenance_date' => now()->subDays(rand(0, 365))->toDateString(),
                'cost' => rand(50000, 500000),
                'result_condition' => $resultConditions[array_rand($resultConditions)],
                'performed_by' => $performerNames[array_rand($performerNames)],
                'notes' => 'Perawatan rutin item no. '.$i,
                'created_by' => $userIds[array_rand($userIds)],
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        DB::table('maintenance_logs')->insert($maintenanceLogs);

        // Inventory Loans (25 records)
        $loanNotes = [
            'Peminjaman untuk event',
            'Peminjaman harian',
            'Peminjaman mingguan',
            'Digunakan untuk latihan',
            'Peminjaman khusus',
        ];

        $loanRecords = [];
        for ($i = 1; $i <= 25; $i++) {
            $borrowedAt = now()->subDays(rand(1, 60));
            $status = $loanStatuses[array_rand($loanStatuses)];
            $loanRecords[] = [
                'inventory_item_id' => rand(1, 25),
                'borrower_name' => $borrowerNames[array_rand($borrowerNames)],
                'borrowed_at' => $borrowedAt,
                'returned_at' => $status === 'dikembalikan' ? $borrowedAt->copy()->addDays(rand(1, 7)) : null,
                'loan_status' => $status,
                'notes' => $loanNotes[array_rand($loanNotes)],
                'created_by' => $userIds[array_rand($userIds)],
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        DB::table('inventory_loans')->insert($loanRecords);
    }
}
