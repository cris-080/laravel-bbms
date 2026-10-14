<?php

use App\Http\Controllers\AuditLogController;
use Illuminate\Support\Facades\Route;

// Require BOTH 'auth' (logged in) and 'role:admin' (Spatie RBAC)
Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::get('/audit-logs', [AuditLogController::class, 'index'])->name('audit-logs.index');
});