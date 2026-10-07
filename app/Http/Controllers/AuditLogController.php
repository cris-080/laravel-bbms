<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use Inertia\Inertia;

class AuditLogController extends Controller
{
    public function index()
    {
        // Fetch logs with the user who performed the action
        $logs = AuditLog::with('user')->latest()->get();
        
        return Inertia::render('AuditLogs/Index', [
            'logs' => $logs
        ]);
    }
}