<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Donor extends Model
{
    protected $fillable = [
        'name',
        'email',
        'age',
        'sex',
        'blood_group',
        'contact_number',
        'address',
        'last_donation_date'
    ];

    public function donations()
    {
        return $this->hasMany(Donation::class);
    }

    public function donationSchedules()
    {
        return $this->hasMany(DonationSchedule::class);
    }

    public function isEligibleToDonate(): bool
    {
        if (!$this->last_donation_date) {
            return true;
        }

        return \Carbon\Carbon::parse($this->last_donation_date)
            ->addDays(56)
            ->isPast();
    }

    public function getNextEligibleDonationDate(): ?string
    {
        if (!$this->last_donation_date) {
            return null;
        }

        return \Carbon\Carbon::parse($this->last_donation_date)
            ->addDays(56)
            ->toDateString();
    }

    /**
     * Query Scope for filtering by search term and blood group.
     */
    public function scopeFilter(Builder $query, array $filters): void
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $query->where(function ($query) use ($search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('contact_number', 'like', "%{$search}%");
            });
        })->when($filters['blood_group'] ?? null, function ($query, $bloodGroup) {
            $query->where('blood_group', $bloodGroup);
        });
    }

    /**
     * Encapsulates donor creation and audit logging.
     */
    public static function createDonorWithLog(array $data, int $actorId): self
    {
        return DB::transaction(function () use ($data, $actorId) {
            $donor = self::create($data);

            AuditLog::create([
                'user_id' => $actorId,
                'action' => 'Added New Donor',
                'details' => "Added donor: {$donor->name} ({$donor->blood_group})",
            ]);

            return $donor;
        });
    }

    /**
     * Encapsulates donor updates and audit logging.
     */
    public function updateDonorWithLog(array $data, int $actorId): void
    {
        DB::transaction(function () use ($data, $actorId) {
            $this->update($data);

            AuditLog::create([
                'user_id' => $actorId,
                'action' => 'Updated Donor',
                'details' => "Updated donor: {$this->name}",
            ]);
        });
    }

    /**
     * Encapsulates donor deletion and audit logging.
     */
    public function deleteDonorWithLog(int $actorId): void
    {
        DB::transaction(function () use ($actorId) {
            $donorName = $this->name;
            $this->delete();

            AuditLog::create([
                'user_id' => $actorId,
                'action' => 'Deleted Donor',
                'details' => "Deleted donor: {$donorName}",
            ]);
        });
    }
}