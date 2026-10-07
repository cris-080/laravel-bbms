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
       Schema::create('donation_schedules', function (Blueprint $table) {
    $table->id();
    $table->foreignId('donor_id')->constrained('donors')->cascadeOnDelete();
    $table->date('appointment_date');
    $table->time('appointment_time');
    $table->enum('status', ['Scheduled', 'Completed', 'Cancelled'])->default('Scheduled');
    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('donation_schedules');
    }
};
