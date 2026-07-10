<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $this->call([
            MembershipPackageSeeder::class,
            AdminUserSeeder::class,
            SupplierSeeder::class,
            InventoryCategorySeeder::class,
            InventoryItemSeeder::class,
            MemberSeeder::class,
            InventoryTransactionSeeder::class,
            ProcurementSeeder::class,
            MemberFinancialSeeder::class,
            ActivitySeeder::class,
        ]);
    }
}
