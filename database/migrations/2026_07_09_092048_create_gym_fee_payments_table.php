<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('gym_fee_payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('member_id')->constrained('members')->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreignId('package_id')->constrained('membership_packages')->restrictOnDelete()->cascadeOnUpdate();
            $table->integer('duration_months');
            $table->date('period_start');
            $table->date('period_end');
            $table->decimal('amount', 12, 2)->default(0.00);
            $table->decimal('admin_fee', 12, 2)->default(0.00);
            // payment_method: 'cash', 'transfer', 'qris', 'debit', 'credit', 'other'
            $table->string('payment_method', 20)->default('cash');
            // payment_status: 'paid', 'unpaid', 'partial', 'overdue'
            $table->string('payment_status', 20)->default('unpaid');
            $table->date('due_date')->nullable();
            $table->dateTime('paid_at')->nullable();
            $table->text('notes')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete()->cascadeOnUpdate();
            $table->timestamps();

            $table->index('payment_status');
            $table->index('due_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('gym_fee_payments');
    }
};
