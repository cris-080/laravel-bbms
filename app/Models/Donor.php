<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Donor extends Model
{
    // app/Models/Donor.php
    protected $fillable = ['name', 'email', 'age', 'sex', 'blood_group', 'contact_number', 'address', 'last_donation_date'];
    public function donations() { return $this->hasMany(Donation::class); }
    public function donationSchedules() { return $this->hasMany(DonationSchedule::class); }
}
