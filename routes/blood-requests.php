<?php

use App\Http\Controllers\BloodRequestController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
    Route::get('/blood-requests', [BloodRequestController::class, 'index'])
        ->name('blood-requests.index');

    Route::get('/blood-requests/create', [BloodRequestController::class, 'create'])
        ->name('blood-requests.create');

    Route::post('/blood-requests', [BloodRequestController::class, 'store'])
        ->name('blood-requests.store');

    Route::post('/blood-requests/{bloodRequest}/approve', [BloodRequestController::class, 'approve'])
        ->name('blood-requests.approve');

    Route::post('/blood-requests/{bloodRequest}/reject', [BloodRequestController::class, 'reject'])
        ->name('blood-requests.reject');
});