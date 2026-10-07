<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DonationSchedule extends Model
{
    // app/Models/DonationSchedule.php
    protected $table = 'donation_schedules';
    protected $fillable = ['donor_id', 'appointment_date', 'appointment_time', 'status'];
    public function donor() { return $this->belongsTo(Donor::class); }
}
