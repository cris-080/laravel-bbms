<?php

namespace App\Http\Controllers;

use App\Http\Requests\BloodRequestFormRequest;
use App\Models\BloodInventory;
use App\Models\BloodRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BloodRequestController extends Controller
{
    public function index()
    {
        $requests = BloodRequest::latest('request_date')->paginate(10);

        $inventory = BloodInventory::orderBy('id')->get([
            'blood_group',
            'total_units',
        ]);

        return Inertia::render('BloodRequests/Index', [
            'requests' => $requests,
            'inventory' => $inventory,
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
        BloodRequest::createWithLog($request->validated(), $request->user()->id);

        return redirect()
            ->route('blood-requests.index')
            ->with('success', 'Blood request created successfully.');
    }

    public function approve(Request $request, BloodRequest $bloodRequest)
    {
        $request->validate([
            'released_to' => ['required', 'string', 'max:100'],
        ]);

        $bloodRequest->approveWithLog($request->released_to, $request->user()->id);

        return redirect()
            ->route('blood-requests.index')
            ->with('success', 'Blood request approved and blood released successfully.');
    }

    public function reject(Request $request, BloodRequest $bloodRequest)
    {
        $bloodRequest->rejectWithLog($request->user()->id);

        return redirect()
            ->route('blood-requests.index')
            ->with('success', 'Blood request rejected.');
    }
}