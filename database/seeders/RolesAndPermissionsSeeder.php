<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // 1. Create Granular Permissions
        $permissions = [
            'manage users',
            'view audit logs',
            'manage inventory',
            'process blood requests',
            'manage donors',
            'manage schedules'
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // 2. Create Roles and Assign Permissions
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        // Admin gets all permissions
        $adminRole->givePermissionTo(Permission::all());

        $staffRole = Role::firstOrCreate(['name' => 'staff']);
        // Staff gets operational permissions, but cannot manage users or view audit logs
        $staffRole->givePermissionTo([
            'manage inventory',
            'process blood requests',
            'manage donors',
            'manage schedules'
        ]);

        // 3. (Optional) Create a default Admin user so you can log in immediately
        $adminUser = User::firstOrCreate(
            ['email' => 'admin@bloodbank.org'],
            [
                'name' => 'System Administrator',
                'password' => Hash::make('password123'),
            ]
        );
        $adminUser->assignRole($adminRole);
    }
}