<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use App\Models\User;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = [
            'view donors',
            'create donors',
            'edit donors',
            'delete donors',
            'view donations',
            'create donations',
            'edit donations',
            'delete donations',
            'view inventory',
            'manage inventory',
            'view requests',
            'create requests',
            'update requests',
            'dispense blood',
            'delete requests',
            'view schedules',
            'create schedules',
            'update schedules',
            'delete schedules',
            'view audit logs',
            'manage users',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate([
                'name' => $permission,
            ]);
        }

        $admin = Role::firstOrCreate(['name' => 'admin']);
        $staff = Role::firstOrCreate(['name' => 'staff']);

        // Admin gets all permissions
        $admin->givePermissionTo($permissions);

        // Staff gets operational permissions (no user management, audit logs, or deletion)
        $staff->givePermissionTo([
            'view donors',
            'create donors',
            'edit donors',
            'view donations',
            'create donations',
            'edit donations',
            'view inventory',
            'view requests',
            'create requests',
            'update requests',
            'dispense blood',
            'view schedules',
            'create schedules',
            'update schedules',
        ]);

        // Create or update default Admin account from blood_bank_db
        $adminUser = User::updateOrCreate(
            ['email' => 'admin@bloodbank.com'],
            [
                'name' => 'Admin',
                'password' => bcrypt('password123'),
            ]
        );
        $adminUser->syncRoles(['admin']);

        // Create or update default Staff account from blood_bank_db
        $staffUser = User::updateOrCreate(
            ['email' => 'john@gmail.com'],
            [
                'name' => 'John Doe',
                'password' => bcrypt('password123'),
            ]
        );
        $staffUser->syncRoles(['staff']);
    }
}