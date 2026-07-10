<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('procurements', function (Blueprint $table) {
            $table->id();
            $table->string('procurement_code', 30)->unique();
            $table->foreignId('item_id')->constrained('inventory_items')->restrictOnDelete()->cascadeOnUpdate();
            $table->foreignId('supplier_id')->constrained('suppliers')->restrictOnDelete()->cascadeOnUpdate();
            $table->integer('quantity');
            $table->decimal('unit_price', 12, 2);
            $table->decimal('total_price', 12, 2);
            $table->date('procurement_date');
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index('procurement_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('procurements');
    }
};
