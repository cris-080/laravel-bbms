<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DonationController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/donations', [DonationController::class, 'index'])->name('donations.index');
    Route::get('/donations/create', [DonationController::class, 'create'])->name('donations.create');
    Route::post('/donations', [DonationController::class, 'store'])->name('donations.store');
});
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/donations', [DonationController::class, 'index'])->name('donations.index');
    Route::get('/donations/create', [DonationController::class, 'create'])->name('donations.create');
    Route::post('/donations', [DonationController::class, 'store'])->name('donations.store');
    
    // Add these two new routes:
    Route::get('/donations/{donation}/edit', [DonationController::class, 'edit'])->name('donations.edit');
    Route::delete('/donations/{donation}', [DonationController::class, 'destroy'])->name('donations.destroy');
});
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/donations', [DonationController::class, 'index'])->name('donations.index');
    Route::get('/donations/create', [DonationController::class, 'create'])->name('donations.create');
    Route::post('/donations', [DonationController::class, 'store'])->name('donations.store');
    Route::get('/donations/{donation}/edit', [DonationController::class, 'edit'])->name('donations.edit');
    
    // Add this new route for handling form submissions:
    Route::put('/donations/{donation}', [DonationController::class, 'update'])->name('donations.update');
    
    Route::delete('/donations/{donation}', [DonationController::class, 'destroy'])->name('donations.destroy');
});