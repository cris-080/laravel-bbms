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
       Schema::create('blood_requests', function (Blueprint $table) {
    $table->id();
    $table->string('physician_name', 255);
    $table->string('patient_name', 100);
    $table->enum('blood_group', ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']);
    $table->integer('units_needed');
    $table->string('status', 50)->default('Pending');
    $table->timestamp('request_date')->useCurrent();
    $table->string('reference_code', 50)->nullable();
    $table->string('released_to', 100)->nullable();
    $table->dateTime('dispensed_at')->nullable();
    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('blood_requests');
    }
};
