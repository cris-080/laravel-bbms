<?php

namespace App\Http\Controllers;

use App\Http\Requests\DonorRequest;
use App\Models\AuditLog;
use App\Models\Donor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DonorController extends Controller
{
    public function index(Request $request)
    {
        $donors = Donor::query()
            ->when($request->search, function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('contact_number', 'like', "%{$search}%");
                });
            })
            ->when($request->blood_group, function ($query, $bloodGroup) {
                $query->where('blood_group', $bloodGroup);
            })
            ->latest()
            ->paginate(10)
            ->withQueryString()
            ->through(function ($donor) {
                return [
                    'id' => $donor->id,
                    'name' => $donor->name,
                    'email' => $donor->email,
                    'age' => $donor->age,
                    'sex' => $donor->sex,
                    'blood_group' => $donor->blood_group,
                    'contact_number' => $donor->contact_number,
                    'address' => $donor->address,
                    'last_donation_date' => $donor->last_donation_date,
                    'is_eligible' => $donor->isEligibleToDonate(),
                    'next_eligible_date' => $donor->getNextEligibleDonationDate(),
                ];
            });

        return Inertia::render('Donors/Index', [
            'donors' => $donors,
            'filters' => $request->only([
                'search',
                'blood_group',
            ]),
        ]);
    }

    public function create()
    {
        return Inertia::render('Donors/Create');
    }

    public function store(DonorRequest $request)
    {
        DB::transaction(function () use ($request) {
            $donor = Donor::create($request->validated());

            AuditLog::create([
                'user_id' => $request->user()->id,
                'action' => 'Added New Donor',
                'details' => "Added donor: {$donor->name} ({$donor->blood_group})",
            ]);
        });

        return redirect()
            ->route('donors.index')
            ->with('success', 'Donor added successfully.');
    }

    public function edit(Donor $donor)
    {
        return Inertia::render('Donors/Edit', [
            'donor' => $donor,
        ]);
    }

    public function update(DonorRequest $request, Donor $donor)
    {
        DB::transaction(function () use ($request, $donor) {
            $donor->update($request->validated());

            AuditLog::create([
                'user_id' => $request->user()->id,
                'action' => 'Updated Donor',
                'details' => "Updated donor: {$donor->name}",
            ]);
        });

        return redirect()
            ->route('donors.index')
            ->with('success', 'Donor updated successfully.');
    }

    public function destroy(Request $request, Donor $donor)
    {
        DB::transaction(function () use ($request, $donor) {
            $donorName = $donor->name;

            $donor->delete();

            AuditLog::create([
                'user_id' => $request->user()->id,
                'action' => 'Deleted Donor',
                'details' => "Deleted donor: {$donorName}",
            ]);
        });

        return redirect()
            ->route('donors.index')
            ->with('success', 'Donor deleted successfully.');
    }
}