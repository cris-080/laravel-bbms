<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuditLogController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/audit-logs', [AuditLogController::class, 'index'])->name('audit-logs.index');
});