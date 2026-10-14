<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

class BloodInventory extends Model
{
    protected $table = 'blood_inventory';
    
    protected $fillable = [
        'blood_group', 
        'total_units', 
        'last_updated'
    ];

    /**
     * Retrieve all blood inventory records consistently ordered by ID.
     */
    public static function getOrderedInventory(): Collection
    {
        return self::orderBy('id')->get();
    }
}