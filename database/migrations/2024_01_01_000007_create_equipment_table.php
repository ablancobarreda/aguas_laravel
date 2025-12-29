<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('equipment', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('location')->nullable();
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->string('imei');
            $table->string('phone');
            $table->text('channel')->nullable();
            $table->string('basin')->nullable();
            $table->foreignId('locality_id')->nullable()->constrained('localities')->onDelete('set null');
            $table->timestamps();
            
            $table->index('imei');
            $table->index('phone');
            $table->index('locality_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('equipment');
    }
};

