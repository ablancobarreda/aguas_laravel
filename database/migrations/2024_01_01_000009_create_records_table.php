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
        Schema::create('records', function (Blueprint $table) {
            $table->id();
            $table->string('ip')->nullable();
            $table->string('cmd');
            $table->string('phone');
            $table->string('imei');
            $table->string('time');
            $table->string('start_time')->default('');
            $table->string('end_time')->default('');
            $table->string('record_date')->default('');
            $table->text('vals');
            $table->string('batt')->nullable();
            $table->string('powr')->nullable();
            $table->string('sigs')->nullable();
            $table->string('nwtype')->nullable();
            $table->timestamps();
            
            $table->index('imei');
            $table->index('phone');
            $table->index('time');
            $table->index('start_time');
            $table->index('end_time');
            $table->index('record_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('records');
    }
};

