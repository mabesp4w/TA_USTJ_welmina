<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inventory_items', function (Blueprint $table) {
            $table->id();
            $table->string('item_code', 30)->unique();
            $table->string('item_name', 100);
            $table->foreignId('category_id')->constrained('inventory_categories')->restrictOnDelete()->cascadeOnUpdate();
            $table->integer('stock')->default(0);
            // item_condition: 'baik', 'perlu_perawatan', 'rusak'
            $table->string('item_condition', 20)->default('baik');
            // item_status: 'aktif', 'tidak_aktif'
            $table->string('item_status', 20)->default('aktif');
            $table->string('location_name', 100)->nullable();
            $table->foreignId('supplier_id')->nullable()->constrained('suppliers')->nullOnDelete()->cascadeOnUpdate();
            $table->date('last_service_date')->nullable();
            // image_path
            $table->string('image_path')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index('item_condition');
            $table->index('item_status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inventory_items');
    }
};
