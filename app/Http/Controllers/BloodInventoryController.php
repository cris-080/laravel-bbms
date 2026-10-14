<?php

namespace App\Http\Controllers;

use App\Models\BloodInventory;
use Inertia\Inertia;
use Illuminate\Http\Request;

class BloodInventoryController extends Controller
{
    public function index()
    {
        return Inertia::render('Inventory/Index', [
            'inventory' => BloodInventory::getOrderedInventory(),
        ]);
    }
}