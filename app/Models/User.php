<?php

namespace App\Models;

use App\Models\AuditLog;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasRoles;

    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed', // Automatically hashes passwords on creation/update
        ];
    }

    /**
     * Encapsulates user creation, role assignment, and audit logging.
     */
    public static function createUserWithRole(array $data, int $actorId): self
    {
        return DB::transaction(function () use ($data, $actorId) {
            $user = self::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => $data['password'],
            ]);

            $user->syncRoles([$data['role']]);

            AuditLog::create([
                'user_id' => $actorId,
                'action' => 'Created User',
                'details' => "Created user {$user->name} with role {$data['role']}",
            ]);

            return $user;
        });
    }

    /**
     * Encapsulates user updates, role syncing, and audit logging.
     */
    public function updateUserWithRole(array $data, int $actorId): void
    {
        DB::transaction(function () use ($data, $actorId) {
            $updateData = [
                'name' => $data['name'],
                'email' => $data['email'],
            ];

            if (!empty($data['password'])) {
                $updateData['password'] = $data['password'];
            }

            $this->update($updateData);
            $this->syncRoles([$data['role']]);

            AuditLog::create([
                'user_id' => $actorId,
                'action' => 'Updated User',
                'details' => "Updated user {$this->name} with role {$data['role']}",
            ]);
        });
    }

    /**
     * Encapsulates user deletion and audit logging.
     */
    public function deleteUser(int $actorId): void
    {
        DB::transaction(function () use ($actorId) {
            AuditLog::create([
                'user_id' => $actorId,
                'action' => 'Deleted User',
                'details' => "Deleted user {$this->name}",
            ]);

            $this->delete();
        });
    }
}