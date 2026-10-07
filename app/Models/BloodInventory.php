<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BloodInventory extends Model
{
    // app/Models/BloodInventory.php
    protected $table = 'blood_inventory';
    protected $fillable = ['blood_group', 'total_units', 'last_updated'];
}
