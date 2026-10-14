<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class DonationSchedule extends Model
{
    protected $table = 'donation_schedules';
    
    protected $fillable = [
        'donor_id', 
        'appointment_date', 
        'appointment_time', 
        'status'
    ];
    
    public function donor() 
    { 
        return $this->belongsTo(Donor::class); 
    }

    /**
     * Encapsulates schedule creation and audit logging.
     */
    public static function createWithLog(array $data, int $actorId): self
    {
        return DB::transaction(function () use ($data, $actorId) {
            $schedule = self::create([
                'donor_id' => $data['donor_id'],
                'appointment_date' => $data['appointment_date'],
                'appointment_time' => $data['appointment_time'],
                'status' => 'Scheduled',
            ]);

            AuditLog::create([
                'user_id' => $actorId,
                'action' => 'Booked Appointment',
                'details' => "Booked donation appointment for donor ID {$schedule->donor_id} on {$schedule->appointment_date}",
            ]);

            return $schedule;
        });
    }

    /**
     * Encapsulates status updates and dynamic audit logging.
     */
    public function updateStatusWithLog(string $status, int $actorId): void
    {
        DB::transaction(function () use ($status, $actorId) {
            $this->update([
                'status' => $status,
            ]);

            $actionName = $status === 'Scheduled' 
                ? 'Updated Appointment Status' 
                : $status . ' Appointment';

            AuditLog::create([
                'user_id' => $actorId,
                'action' => $actionName,
                'details' => "Schedule ID {$this->id} changed to {$status}",
            ]);
        });
    }
}