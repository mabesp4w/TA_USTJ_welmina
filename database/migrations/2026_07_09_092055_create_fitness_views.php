<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("
            CREATE OR REPLACE VIEW vw_inventory_summary AS
            SELECT
                COUNT(*) AS total_item_rows,
                COALESCE(SUM(stock), 0) AS total_stock,
                SUM(CASE WHEN item_condition = 'baik' THEN 1 ELSE 0 END) AS kondisi_baik,
                SUM(CASE WHEN item_condition = 'perlu_perawatan' THEN 1 ELSE 0 END) AS perlu_perawatan,
                SUM(CASE WHEN item_condition = 'rusak' OR item_status = 'tidak_aktif' THEN 1 ELSE 0 END) AS rusak_tidak_aktif
            FROM inventory_items
        ");

        DB::statement("
            CREATE OR REPLACE VIEW vw_member_summary AS
            SELECT
                COUNT(*) AS total_members,
                SUM(CASE WHEN member_status = 'active' THEN 1 ELSE 0 END) AS active_members,
                SUM(CASE WHEN member_status = 'expired' THEN 1 ELSE 0 END) AS expired_members,
                SUM(CASE WHEN member_status = 'inactive' THEN 1 ELSE 0 END) AS inactive_members
            FROM members
        ");

        DB::statement("
            CREATE OR REPLACE VIEW vw_monthly_financial_summary AS
            SELECT
                DATE_FORMAT(payment_date, '%Y-%m') AS periode,
                SUM(registration_income) AS total_pendaftaran,
                SUM(gym_income) AS total_iuran,
                SUM(registration_income + gym_income) AS total_pendapatan
            FROM (
                SELECT
                    registration_date AS payment_date,
                    (registration_fee + admin_fee) AS registration_income,
                    0 AS gym_income
                FROM registration_payments
                WHERE payment_status = 'paid'

                UNION ALL

                SELECT
                    DATE(paid_at) AS payment_date,
                    0 AS registration_income,
                    (amount + admin_fee) AS gym_income
                FROM gym_fee_payments
                WHERE payment_status = 'paid' AND paid_at IS NOT NULL
            ) x
            GROUP BY DATE_FORMAT(payment_date, '%Y-%m')
            ORDER BY periode DESC
        ");
    }

    public function down(): void
    {
        DB::statement('DROP VIEW IF EXISTS vw_inventory_summary');
        DB::statement('DROP VIEW IF EXISTS vw_member_summary');
        DB::statement('DROP VIEW IF EXISTS vw_monthly_financial_summary');
    }
};
