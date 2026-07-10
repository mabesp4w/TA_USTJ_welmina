<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('members', function (Blueprint $table) {
            $table->id();
            $table->string('member_code', 30)->unique();
            $table->string('full_name', 100);
            $table->string('identity_no', 30)->nullable()->unique();
            // gender: 'L', 'P'
            $table->string('gender', 2)->nullable();
            $table->date('birth_date')->nullable();
            $table->string('phone', 20)->nullable();
            $table->string('email', 100)->nullable();
            $table->text('address')->nullable();
            // member_status: 'active', 'expired', 'inactive'
            $table->string('member_status', 20)->default('active');
            $table->dateTime('joined_at')->useCurrent();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete()->cascadeOnUpdate();
            $table->timestamps();

            $table->index('member_status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('members');
    }
};
