<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('maintenance_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('inventory_item_id')->constrained('inventory_items')->cascadeOnDelete()->cascadeOnUpdate();
            // maintenance_type: 'service', 'repair', 'inspection'
            $table->string('maintenance_type', 20)->default('service');
            $table->date('maintenance_date');
            $table->decimal('cost', 12, 2)->default(0.00);
            // result_condition: 'baik', 'perlu_perawatan', 'rusak'
            $table->string('result_condition', 20)->default('baik');
            $table->string('performed_by', 100)->nullable();
            $table->text('notes')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete()->cascadeOnUpdate();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('maintenance_logs');
    }
};
