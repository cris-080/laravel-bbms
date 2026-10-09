<?php

namespace App\Http\Controllers;

use App\Http\Requests\BloodRequestFormRequest;
use App\Models\AuditLog;
use App\Models\BloodInventory;
use App\Models\BloodRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class BloodRequestController extends Controller
{
    public function index()
    {
        $requests = BloodRequest::latest('request_date')
            ->paginate(10);

        return Inertia::render('BloodRequests/Index', [
            'requests' => $requests,
        ]);
    }

    public function create()
    {
        $inventory = BloodInventory::orderBy('id')->get([
            'blood_group',
            'total_units',
        ]);

        return Inertia::render('BloodRequests/Create', [
            'inventory' => $inventory,
        ]);
    }

    public function store(BloodRequestFormRequest $request)
    {
        DB::transaction(function () use ($request) {
            $bloodRequest = BloodRequest::create([
                ...$request->validated(),
                'status' => 'Pending',
                'request_date' => now(),
            ]);

            AuditLog::create([
                'user_id' => $request->user()->id,
                'action' => 'Created Blood Request',
                'details' => "Blood request created for {$bloodRequest->patient_name} ({$bloodRequest->blood_group}, {$bloodRequest->units_needed} unit/s)",
            ]);
        });

        return redirect()
            ->route('blood-requests.index')
            ->with('success', 'Blood request created successfully.');
    }

    public function approve(Request $request, BloodRequest $bloodRequest)
    {
        $request->validate([
            'released_to' => ['required', 'string', 'max:100'],
        ]);

        DB::transaction(function () use ($request, $bloodRequest) {
            $bloodRequest = BloodRequest::query()
                ->lockForUpdate()
                ->findOrFail($bloodRequest->id);

            if ($bloodRequest->status !== 'Pending') {
                throw ValidationException::withMessages([
                    'status' => 'Only pending requests can be approved.',
                ]);
            }

            $inventory = BloodInventory::query()
                ->where('blood_group', $bloodRequest->blood_group)
                ->lockForUpdate()
                ->first();

            if (!$inventory) {
                throw ValidationException::withMessages([
                    'inventory' => 'No inventory record exists for this blood group.',
                ]);
            }

            if ($inventory->total_units < $bloodRequest->units_needed) {
                throw ValidationException::withMessages([
                    'inventory' => 'Not enough blood units available for this request.',
                ]);
            }

            $inventory->decrement(
                'total_units',
                $bloodRequest->units_needed
            );

            $bloodRequest->update([
                'status' => 'Handed Over',
                'reference_code' => $this->generateReferenceCode(),
                'released_to' => $request->released_to,
                'dispensed_at' => now(),
            ]);

            AuditLog::create([
                'user_id' => $request->user()->id,
                'action' => 'Dispensed Blood',
                'details' => "Dispensed {$bloodRequest->units_needed} unit/s of {$bloodRequest->blood_group} blood for {$bloodRequest->patient_name}",
            ]);
        });

        return redirect()
            ->route('blood-requests.index')
            ->with('success', 'Blood request approved and blood released successfully.');
    }

    public function reject(Request $request, BloodRequest $bloodRequest)
    {
        DB::transaction(function () use ($request, $bloodRequest) {
            $bloodRequest = BloodRequest::query()
                ->lockForUpdate()
                ->findOrFail($bloodRequest->id);

            if ($bloodRequest->status !== 'Pending') {
                throw ValidationException::withMessages([
                    'status' => 'Only pending requests can be rejected.',
                ]);
            }

            $bloodRequest->update([
                'status' => 'Rejected',
            ]);

            AuditLog::create([
                'user_id' => $request->user()->id,
                'action' => 'Rejected Blood Request',
                'details' => "Rejected blood request for {$bloodRequest->patient_name}",
            ]);
        });

        return redirect()
            ->route('blood-requests.index')
            ->with('success', 'Blood request rejected.');
    }

    private function generateReferenceCode(): string
    {
        do {
            $code = 'TRX-' . random_int(100000, 999999) . '-BLD';
        } while (
            BloodRequest::where('reference_code', $code)->exists()
        );

        return $code;
    }
}