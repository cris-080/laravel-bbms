<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Donation extends Model
{
    // app/Models/Donation.php
    protected $fillable = ['donor_id', 'donation_date', 'units_donated', 'status'];
    public function donor() { return $this->belongsTo(Donor::class); }
}
