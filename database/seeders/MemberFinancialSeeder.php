<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MemberFinancialSeeder extends Seeder
{
    public function run(): void
    {
        $paymentMethods = ['tunai', 'transfer', 'kartu_kredit', 'e_wallet'];
        $paymentStatuses = ['paid', 'unpaid', 'cancelled'];
        $membershipStatuses = ['aktif', 'expired', 'cancelled'];
        $userIds = range(2, 23);

        // Registration Payments (25 records)
        $payments = [];
        for ($i = 1; $i <= 25; $i++) {
            $packageId = rand(1, 3);
            $fees = [1 => 150000, 2 => 200000, 3 => 300000];
            $adminFees = [1 => 25000, 2 => 30000, 3 => 35000];
            $status = $paymentStatuses[array_rand($paymentStatuses)];

            $payments[] = [
                'member_id' => $i,
                'package_id' => $packageId,
                'registration_date' => now()->subDays(rand(0, 365))->toDateString(),
                'registration_fee' => $fees[$packageId],
                'admin_fee' => $adminFees[$packageId],
                'payment_method' => $paymentMethods[array_rand($paymentMethods)],
                'payment_status' => $status,
                'notes' => $status === 'paid' ? null : 'Menunggu pembayaran',
                'created_by' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        DB::table('registration_payments')->insert($payments);

        // Member Memberships (25 records)
        $durationOptions = [1, 3, 6];
        $packagePrices = [
            1 => [1 => 250000, 3 => 700000, 6 => 1750000],
            2 => [1 => 350000, 3 => 950000, 6 => 2400000],
            3 => [1 => 500000, 3 => 1350000, 6 => 3250000],
        ];

        $memberships = [];
        for ($i = 1; $i <= 25; $i++) {
            $packageId = rand(1, 3);
            $duration = $durationOptions[array_rand($durationOptions)];
            $startDate = now()->subDays(rand(0, 180));
            $endDate = (clone $startDate)->addMonths($duration);
            $price = $packagePrices[$packageId][$duration];
            $adminFee = [1 => 15000, 2 => 20000, 3 => 25000][$packageId];
            $status = $membershipStatuses[array_rand($membershipStatuses)];

            $memberships[] = [
                'member_id' => $i,
                'package_id' => $packageId,
                'duration_months' => $duration,
                'start_date' => $startDate->toDateString(),
                'end_date' => $endDate->toDateString(),
                'amount' => $price,
                'admin_fee' => $adminFee,
                'payment_method' => $paymentMethods[array_rand($paymentMethods)],
                'payment_status' => $paymentStatuses[array_rand($paymentStatuses)],
                'due_date' => (clone $startDate)->addDays(7)->toDateString(),
                'paid_at' => $status === 'aktif' ? $startDate : null,
                'status' => $status,
                'notes' => null,
                'created_by' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        DB::table('member_memberships')->insert($memberships);
    }
}
