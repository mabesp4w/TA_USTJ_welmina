<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('activity_logs', function (Blueprint $table) {
            $table->id();
            $table->dateTime('activity_time')->useCurrent();
            $table->string('activity_name', 100);
            // activity_type: 'tambah', 'servis', 'pinjam', 'kembali', 'rusak', 'pengadaan', 'pembayaran', 'pendaftaran', 'lainnya'
            $table->string('activity_type', 20)->default('lainnya');
            $table->foreignId('inventory_item_id')->nullable()->constrained('inventory_items')->nullOnDelete()->cascadeOnUpdate();
            $table->foreignId('member_id')->nullable()->constrained('members')->nullOnDelete()->cascadeOnUpdate();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete()->cascadeOnUpdate();
            $table->text('description')->nullable();
            $table->string('reference_table', 50)->nullable();
            $table->unsignedBigInteger('reference_id')->nullable();
            $table->timestamps();

            $table->index('activity_time');
            $table->index('activity_type');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('activity_logs');
    }
};
