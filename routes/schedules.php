<?php

use App\Http\Controllers\ScheduleController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
    Route::get('/schedules', [ScheduleController::class, 'index'])
        ->name('schedules.index');

    Route::get('/schedules/create', [ScheduleController::class, 'create'])
        ->name('schedules.create');

    Route::post('/schedules', [ScheduleController::class, 'store'])
        ->name('schedules.store');

    Route::patch('/schedules/{schedule}/status', [ScheduleController::class, 'updateStatus'])
        ->name('schedules.update-status');
});