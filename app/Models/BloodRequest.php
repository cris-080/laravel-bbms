<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class BloodRequest extends Model
{
    protected $fillable = [
        'physician_name', 
        'patient_name', 
        'blood_group', 
        'units_needed', 
        'status', 
        'request_date', 
        'reference_code', 
        'released_to', 
        'dispensed_at'
    ];

    /**
     * Encapsulates blood request creation and audit logging.
     */
    public static function createWithLog(array $data, int $actorId): self
    {
        return DB::transaction(function () use ($data, $actorId) {
            $bloodRequest = self::create([
                ...$data,
                'status' => 'Pending',
                'request_date' => now(),
            ]);

            AuditLog::create([
                'user_id' => $actorId,
                'action' => 'Created Blood Request',
                'details' => "Blood request created for {$bloodRequest->patient_name} ({$bloodRequest->blood_group}, {$bloodRequest->units_needed} unit/s)",
            ]);

            return $bloodRequest;
        });
    }

    /**
     * Encapsulates approval logic, row locking, inventory checking/deduction, and audit logging.
     */
    public function approveWithLog(string $releasedTo, int $actorId): void
    {
        DB::transaction(function () use ($releasedTo, $actorId) {
            // Lock the request row to prevent race conditions
            $request = self::query()->lockForUpdate()->findOrFail($this->id);

            if ($request->status !== 'Pending') {
                throw ValidationException::withMessages([
                    'status' => 'Only pending requests can be approved.',
                ]);
            }

            // Lock the inventory row for safe deduction
            $inventory = BloodInventory::query()
                ->where('blood_group', $request->blood_group)
                ->lockForUpdate()
                ->first();

            if (!$inventory) {
                throw ValidationException::withMessages([
                    'inventory' => 'No inventory record exists for this blood group.',
                ]);
            }

            if ($inventory->total_units < $request->units_needed) {
                throw ValidationException::withMessages([
                    'inventory' => 'Not enough blood units available for this request.',
                ]);
            }

            $inventory->decrement('total_units', $request->units_needed);

            $request->update([
                'status' => 'Handed Over',
                'reference_code' => self::generateReferenceCode(),
                'released_to' => $releasedTo,
                'dispensed_at' => now(),
            ]);

            AuditLog::create([
                'user_id' => $actorId,
                'action' => 'Dispensed Blood',
                'details' => "Dispensed {$request->units_needed} unit/s of {$request->blood_group} blood for {$request->patient_name}",
            ]);
        });
    }

    /**
     * Encapsulates rejection logic, row locking, and audit logging.
     */
    public function rejectWithLog(int $actorId): void
    {
        DB::transaction(function () use ($actorId) {
            $request = self::query()->lockForUpdate()->findOrFail($this->id);

            if ($request->status !== 'Pending') {
                throw ValidationException::withMessages([
                    'status' => 'Only pending requests can be rejected.',
                ]);
            }

            $request->update([
                'status' => 'Rejected',
            ]);

            AuditLog::create([
                'user_id' => $actorId,
                'action' => 'Rejected Blood Request',
                'details' => "Rejected blood request for {$request->patient_name}",
            ]);
        });
    }

    /**
     * Generates a unique transaction reference code.
     */
    public static function generateReferenceCode(): string
    {
        do {
            $code = 'TRX-' . random_int(100000, 999999) . '-BLD';
        } while (self::where('reference_code', $code)->exists());

        return $code;
    }
}