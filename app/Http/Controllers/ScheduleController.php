<?php

namespace App\Http\Controllers;

use App\Models\DonationSchedule;
use App\Models\Donor;
use Illuminate\Http\Request;
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

        $donors = Donor::orderBy('name')->get([
            'id',
            'name',
            'blood_group',
            'last_donation_date',
        ]);

        return Inertia::render('Schedules/Index', [
            'schedules' => $schedules,
            'donors' => $donors,
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

        DonationSchedule::createWithLog($validated, $request->user()->id);

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

        $schedule->updateStatusWithLog($validated['status'], $request->user()->id);

        return redirect()
            ->route('schedules.index')
            ->with('success', 'Schedule status updated successfully.');
    }
}