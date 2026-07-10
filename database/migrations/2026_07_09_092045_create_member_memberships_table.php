<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('member_memberships', function (Blueprint $table) {
            $table->id();
            $table->foreignId('member_id')->constrained('members')->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreignId('package_id')->constrained('membership_packages')->restrictOnDelete()->cascadeOnUpdate();
            $table->integer('duration_months');
            $table->date('start_date');
            $table->date('end_date');
            $table->decimal('amount', 12, 2)->default(0.00);
            $table->decimal('admin_fee', 12, 2)->default(0.00);
            $table->string('payment_method', 20)->default('cash');
            $table->string('payment_status', 20)->default('unpaid');
            $table->date('due_date')->nullable();
            $table->dateTime('paid_at')->nullable();
            // status: 'active', 'expired', 'inactive', 'pending'
            $table->string('status', 20)->default('active');
            $table->text('notes')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete()->cascadeOnUpdate();
            $table->timestamps();

            $table->index('member_id');
            $table->index('payment_status');
            $table->index('due_date');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('member_memberships');
    }
};
