<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('membership_package_prices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('package_id')->constrained('membership_packages')->cascadeOnDelete()->cascadeOnUpdate();
            $table->integer('duration_months');
            $table->decimal('price', 12, 2);
            $table->timestamps();

            $table->unique(['package_id', 'duration_months']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('membership_package_prices');
    }
};
