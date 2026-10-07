<?php

namespace App\Http\Controllers;

use App\Models\Donation;
use App\Models\Donor;
use App\Models\BloodInventory;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DonationController extends Controller
{
    // Display the Donation History table
    public function index()
    {
        $donations = Donation::with('donor')->latest('donation_date')->get();
        return Inertia::render('Donations/Index', [
            'donations' => $donations
        ]);
    }

    // Display the form to record a new blood collection
    public function create()
    {
        $donors = Donor::orderBy('name')->get(['id', 'name', 'blood_group']);
        return Inertia::render('Donations/Create', [
            'donors' => $donors
        ]);
    }

    // Process the donation and execute the inventory math
    public function store(Request $request)
    {
        $validated = $request->validate([
            'donor_id' => 'required|exists:donors,id',
            'donation_date' => 'required|date',
            'units_donated' => 'required|integer|min:1',
            'status' => 'required|in:Pending,Completed,Cancelled'
        ]);

        // Use a database transaction to ensure all or nothing updates
        DB::transaction(function () use ($validated, $request) {
            
            // 1. Save the donation record
            $donation = Donation::create($validated);
            $donor = Donor::find($validated['donor_id']);

            // 2. If completed, execute inventory math and update donor
            if ($validated['status'] === 'Completed') {
                
                $donor->update(['last_donation_date' => $validated['donation_date']]);

                BloodInventory::where('blood_group', $donor->blood_group)
                    ->increment('total_units', $validated['units_donated']);
            }

            // 3. Log the action to the audit trail
            AuditLog::create([
                'user_id' => $request->user()->id,
                'action' => "Recorded {$validated['status']} Donation",
                'details' => "Processed {$validated['units_donated']} unit(s) from {$donor->name} ({$donor->blood_group})."
            ]);
        });

        return redirect()->route('donations.index')->with('success', 'Blood donation recorded and inventory updated.');
    }
    // Show the edit form
    public function edit(Donation $donation)
    {
        $donors = Donor::orderBy('name')->get(['id', 'name', 'blood_group']);
        return Inertia::render('Donations/Edit', [
            'donation' => $donation,
            'donors' => $donors
        ]);
    }
    // Process the update and recalculate inventory math
    public function update(Request $request, Donation $donation)
    {
        $validated = $request->validate([
            'donor_id' => 'required|exists:donors,id',
            'donation_date' => 'required|date',
            'units_donated' => 'required|integer|min:1',
            'status' => 'required|in:Pending,Completed,Cancelled'
        ]);

        DB::transaction(function () use ($validated, $donation, $request) {
            $oldStatus = $donation->status;
            $oldUnits = $donation->units_donated;
            $donor = Donor::find($validated['donor_id']);

            // 1. Revert old inventory math if the previous status was Completed
            if ($oldStatus === 'Completed') {
                BloodInventory::where('blood_group', $donor->blood_group)
                    ->decrement('total_units', $oldUnits);
            }

            // 2. Update the actual donation record
            $donation->update($validated);

            // 3. Apply new inventory math if the new status is Completed
            if ($validated['status'] === 'Completed') {
                $donor->update(['last_donation_date' => $validated['donation_date']]);
                BloodInventory::where('blood_group', $donor->blood_group)
                    ->increment('total_units', $validated['units_donated']);
            }

            // 4. Log the modification to the audit trail
            AuditLog::create([
                'user_id' => $request->user()->id,
                'action' => "Modified Donation Record",
                'details' => "Updated donation for {$donor->name} to {$validated['status']} ({$validated['units_donated']} units)."
            ]);
        });

        return redirect()->route('donations.index')->with('success', 'Donation updated and inventory recalculated.');
    }

    // Process the deletion and revert inventory math safely
    public function destroy(Request $request, Donation $donation)
    {
        DB::transaction(function () use ($donation, $request) {
            
            // 1. Revert inventory if the donation was already completed
            if ($donation->status === 'Completed') {
                $donor = Donor::find($donation->donor_id);
                BloodInventory::where('blood_group', $donor->blood_group)
                    ->decrement('total_units', $donation->units_donated);
            }

            // 2. Log the deletion to the audit trail
            AuditLog::create([
                'user_id' => $request->user()->id,
                'action' => "Deleted Donation Record",
                'details' => "Removed a {$donation->status} donation of {$donation->units_donated} unit(s) from {$donation->donor->name}."
            ]);

            // 3. Delete the actual record
            $donation->delete();
        });

        return redirect()->route('donations.index')->with('success', 'Donation deleted and inventory adjusted.');
    }
}