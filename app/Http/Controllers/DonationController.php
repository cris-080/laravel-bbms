<?php

namespace App\Http\Controllers;

use App\Models\Donation;
use App\Models\Donor;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DonationController extends Controller
{
    // Display the Donation History table
    public function index()
    {
        $donations = Donation::with('donor')
            ->orderBy('donation_date', 'desc')
            ->get();

        $donors = Donor::orderBy('name')->get([
            'id',
            'name',
            'blood_group'
        ]);

        return Inertia::render('Donations/Index', [
            'donations' => $donations,
            'donors' => $donors,
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

    // Process the donation and execute the inventory math via the Model
    public function store(Request $request)
    {
        $validated = $request->validate([
            'donor_id' => 'required|exists:donors,id',
            'donation_date' => 'required|date',
            'units_donated' => 'required|integer|min:1',
            'status' => 'required|in:Pending,Completed,Cancelled'
        ]);

        Donation::createWithLog($validated, $request->user()->id);

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

    // Process the update and recalculate inventory math via the Model
    public function update(Request $request, Donation $donation)
    {
        $validated = $request->validate([
            'donor_id' => 'required|exists:donors,id',
            'donation_date' => 'required|date',
            'units_donated' => 'required|integer|min:1',
            'status' => 'required|in:Pending,Completed,Cancelled'
        ]);

        $donation->updateWithLog($validated, $request->user()->id);

        return redirect()->route('donations.index')->with('success', 'Donation updated and inventory recalculated.');
    }

    // Process the deletion and revert inventory math safely via the Model
    public function destroy(Request $request, Donation $donation)
    {
        $donation->deleteWithLog($request->user()->id);

        return redirect()->route('donations.index')->with('success', 'Donation deleted and inventory adjusted.');
    }
}