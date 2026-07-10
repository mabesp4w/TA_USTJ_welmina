<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('procurement_requests', function (Blueprint $table) {
            $table->id();
            $table->string('request_no', 30)->unique();
            $table->string('item_name', 100);
            $table->foreignId('category_id')->nullable()->constrained('inventory_categories')->nullOnDelete()->cascadeOnUpdate();
            $table->integer('quantity');
            $table->decimal('estimated_price', 12, 2)->default(0.00);
            $table->foreignId('supplier_id')->nullable()->constrained('suppliers')->nullOnDelete()->cascadeOnUpdate();
            $table->date('required_date')->nullable();
            $table->text('description')->nullable();
            // request_status: 'pending', 'approved', 'rejected'
            $table->string('request_status', 20)->default('pending');
            $table->foreignId('requested_by')->nullable()->constrained('users', 'id')->nullOnDelete()->cascadeOnUpdate();
            $table->foreignId('approved_by')->nullable()->constrained('users', 'id')->nullOnDelete()->cascadeOnUpdate();
            $table->dateTime('approved_at')->nullable();
            $table->timestamps();

            $table->index('request_status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('procurement_requests');
    }
};
