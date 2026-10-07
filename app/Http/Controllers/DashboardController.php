<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Donor;
use App\Models\BloodInventory;
use App\Models\BloodRequest;
use App\Models\DonationSchedule;
use App\Models\Donation;
use App\Models\AuditLog;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('Dashboard', [
            'stats' => [
                'totalDonors' => Donor::count(),
                'totalUnitsAvailable' => BloodInventory::sum('total_units'),
                'pendingRequestsCount' => BloodRequest::where('status', 'Pending')->count(),
                'scheduledAppointmentsCount' => DonationSchedule::where('status', 'Scheduled')->count(),
                'completedDonationsCount' => Donation::where('status', 'Completed')->count(),
            ],
            'bloodInventory' => BloodInventory::orderBy('id')->get(),
            'recentRequests' => BloodRequest::latest('request_date')->take(5)->get(),
            'upcomingSchedules' => DonationSchedule::with('donor')
                ->where('status', 'Scheduled')
                ->orderBy('appointment_date')
                ->orderBy('appointment_time')
                ->take(5)->get(),
            'recentAuditLogs' => $request->user()->hasRole('admin') 
                ? AuditLog::with('user')->latest()->take(6)->get() 
                : [],
        ]);
    }
}