<?php

namespace App\Http\Controllers;

use App\Models\BloodInventory;
use Inertia\Inertia;
use Illuminate\Http\Request;

class BloodInventoryController extends Controller
{
    public function index()
    {
        // Fetch all 8 blood groups ordered by ID
        $inventory = BloodInventory::orderBy('id')->get();
        
        return Inertia::render('Inventory/Index', [
            'inventory' => $inventory
        ]);
    }
}