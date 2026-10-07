<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BloodRequest extends Model
{
    // app/Models/BloodRequest.php
    protected $fillable = ['physician_name', 'patient_name', 'blood_group', 'units_needed', 'status', 'request_date', 'reference_code', 'released_to', 'dispensed_at'];
}
