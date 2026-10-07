<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;

// Redirect root visits directly to the login page
Route::get('/', function () {
    return redirect('/login');
});

// Protected routes (require login)
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Your teammates' modular routes will eventually be required here
});

// Load Member 2 Modular Routes
require __DIR__.'/inventory.php';
// Load Member 2 Modular Routes
require __DIR__.'/inventory.php';
require __DIR__.'/donations.php';
// Member 2 Audit Log Route
require __DIR__.'/inventory.php';
require __DIR__.'/donations.php';
require __DIR__.'/audits.php'; // New Audit Route
require __DIR__.'/donors.php';