<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BloodInventoryController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/inventory', [BloodInventoryController::class, 'index'])->name('inventory.index');
});