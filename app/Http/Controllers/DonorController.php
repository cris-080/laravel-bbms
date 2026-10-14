<?php

namespace App\Http\Controllers;

use App\Http\Requests\DonorRequest;
use App\Models\Donor;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DonorController extends Controller
{
    public function index(Request $request)
    {
        $filters = $request->only(['search', 'blood_group']);

        $donors = Donor::query()
            ->filter($filters)
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
            'filters' => $filters,
        ]);
    }

    public function create()
    {
        return Inertia::render('Donors/Create');
    }

    public function store(DonorRequest $request)
    {
        Donor::createDonorWithLog($request->validated(), $request->user()->id);

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
        $donor->updateDonorWithLog($request->validated(), $request->user()->id);

        return redirect()
            ->route('donors.index')
            ->with('success', 'Donor updated successfully.');
    }

    public function destroy(Request $request, Donor $donor)
    {
        $donor->deleteDonorWithLog($request->user()->id);

        return redirect()
            ->route('donors.index')
            ->with('success', 'Donor deleted successfully.');
    }
}