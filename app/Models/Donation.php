<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Donation extends Model
{
    protected $fillable = [
        'donor_id', 
        'donation_date', 
        'units_donated', 
        'status'
    ];

    public function donor() 
    { 
        return $this->belongsTo(Donor::class); 
    }

    /**
     * Encapsulates donation creation, inventory math, and audit logging.
     */
    public static function createWithLog(array $data, int $actorId): self
    {
        return DB::transaction(function () use ($data, $actorId) {
            
            // 1. Save the donation record
            $donation = self::create($data);
            $donor = Donor::find($data['donor_id']);

            // 2. If completed, execute inventory math and update donor
            if ($data['status'] === 'Completed') {
                $donor->update(['last_donation_date' => $data['donation_date']]);

                BloodInventory::where('blood_group', $donor->blood_group)
                    ->increment('total_units', $data['units_donated']);
            }

            // 3. Log the action to the audit trail
            AuditLog::create([
                'user_id' => $actorId,
                'action' => "Recorded {$data['status']} Donation",
                'details' => "Processed {$data['units_donated']} unit(s) from {$donor->name} ({$donor->blood_group})."
            ]);

            return $donation;
        });
    }

    /**
     * Encapsulates donation updates, inventory recalculation, and audit logging.
     */
    public function updateWithLog(array $data, int $actorId): void
    {
        DB::transaction(function () use ($data, $actorId) {
            $oldStatus = $this->status;
            $oldUnits = $this->units_donated;
            $donor = Donor::find($data['donor_id']);

            // 1. Revert old inventory math if the previous status was Completed
            if ($oldStatus === 'Completed') {
                BloodInventory::where('blood_group', $donor->blood_group)
                    ->decrement('total_units', $oldUnits);
            }

            // 2. Update the actual donation record
            $this->update($data);

            // 3. Apply new inventory math if the new status is Completed
            if ($data['status'] === 'Completed') {
                $donor->update(['last_donation_date' => $data['donation_date']]);
                BloodInventory::where('blood_group', $donor->blood_group)
                    ->increment('total_units', $data['units_donated']);
            }

            // 4. Log the modification to the audit trail
            AuditLog::create([
                'user_id' => $actorId,
                'action' => "Modified Donation Record",
                'details' => "Updated donation for {$donor->name} to {$data['status']} ({$data['units_donated']} units)."
            ]);
        });
    }

    /**
     * Encapsulates donation deletion, safe inventory reversion, and audit logging.
     */
    public function deleteWithLog(int $actorId): void
    {
        DB::transaction(function () use ($actorId) {
            
            // Eager load donor for the log and inventory logic if not loaded
            $this->loadMissing('donor');

            // 1. Revert inventory if the donation was already completed
            if ($this->status === 'Completed') {
                BloodInventory::where('blood_group', $this->donor->blood_group)
                    ->decrement('total_units', $this->units_donated);
            }

            // 2. Log the deletion to the audit trail
            AuditLog::create([
                'user_id' => $actorId,
                'action' => "Deleted Donation Record",
                'details' => "Removed a {$this->status} donation of {$this->units_donated} unit(s) from {$this->donor->name}."
            ]);

            // 3. Delete the actual record
            $this->delete();
        });
    }
}