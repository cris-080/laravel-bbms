<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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
}