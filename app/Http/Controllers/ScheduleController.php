<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\DonationSchedule;
use App\Models\Donor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ScheduleController extends Controller
{
    public function index()
    {
        $schedules = DonationSchedule::with('donor')
            ->orderBy('appointment_date')
            ->orderBy('appointment_time')
            ->paginate(10);

        return Inertia::render('Schedules/Index', [
            'schedules' => $schedules,
        ]);
    }

    public function create()
    {
        $donors = Donor::orderBy('name')->get([
            'id',
            'name',
            'blood_group',
            'last_donation_date',
        ]);

        return Inertia::render('Schedules/Create', [
            'donors' => $donors,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'donor_id' => [
                'required',
                'exists:donors,id',
            ],

            'appointment_date' => [
                'required',
                'date',
                'after_or_equal:today',
            ],

            'appointment_time' => [
                'required',
                'date_format:H:i',
            ],
        ]);

        DB::transaction(function () use ($request, $validated) {
            $schedule = DonationSchedule::create([
                ...$validated,
                'status' => 'Scheduled',
            ]);

            AuditLog::create([
                'user_id' => $request->user()->id,
                'action' => 'Booked Appointment',
                'details' => "Booked donation appointment for donor ID {$schedule->donor_id} on {$schedule->appointment_date}",
            ]);
        });

        return redirect()
            ->route('schedules.index')
            ->with('success', 'Donation schedule created successfully.');
    }

    public function updateStatus(Request $request, DonationSchedule $schedule)
    {
        $validated = $request->validate([
            'status' => [
                'required',
                Rule::in([
                    'Scheduled',
                    'Completed',
                    'Cancelled',
                ]),
            ],
        ]);

        DB::transaction(function () use ($request, $schedule, $validated) {
            $schedule->update([
                'status' => $validated['status'],
            ]);

            AuditLog::create([
                'user_id' => $request->user()->id,
                'action' => 'Updated Appointment Status',
                'details' => "Schedule ID {$schedule->id} changed to {$validated['status']}",
            ]);
        });

        return redirect()
            ->route('schedules.index')
            ->with('success', 'Schedule status updated successfully.');
    }
}