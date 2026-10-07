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
        Schema::create('donations', function (Blueprint $table) {
    $table->id();
    $table->foreignId('donor_id')->constrained('donors')->cascadeOnDelete();
    $table->date('donation_date');
    $table->integer('units_donated')->default(0);
    $table->enum('status', ['Pending', 'Completed', 'Cancelled'])->default('Completed');
    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('donations');
    }
};
