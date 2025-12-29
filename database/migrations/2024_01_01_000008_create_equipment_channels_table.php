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
        Schema::create('equipment_channels', function (Blueprint $table) {
            $table->id();
            $table->string('equipment_id');
            $table->foreignId('channel_id')->constrained('channels')->onDelete('cascade');
            $table->timestamps();
            
            $table->foreign('equipment_id')->references('id')->on('equipment')->onDelete('cascade');
            $table->unique(['equipment_id', 'channel_id']);
            $table->index('equipment_id');
            $table->index('channel_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('equipment_channels');
    }
};

