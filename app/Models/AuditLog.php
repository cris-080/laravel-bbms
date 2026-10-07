<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class AuditLog extends Model
{
    protected $fillable = ['user_id', 'action', 'details'];

    // This is the missing relationship Laravel is looking for
    public function user() 
    { 
        return $this->belongsTo(User::class); 
    }
}