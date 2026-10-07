<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\BloodInventory;

class BloodBankSeeder extends Seeder
{
    public function run(): void
    
    {
        $this->call([
            RolePermissionSeeder::class,
            BloodBankSeeder::class,
        ]);
        $inventory = [
            ['blood_group' => 'A+', 'total_units' => 16],
            ['blood_group' => 'A-', 'total_units' => 0],
            ['blood_group' => 'B+', 'total_units' => 1],
            ['blood_group' => 'B-', 'total_units' => 3],
            ['blood_group' => 'AB+', 'total_units' => 7],
            ['blood_group' => 'AB-', 'total_units' => 3],
            ['blood_group' => 'O+', 'total_units' => 4],
            ['blood_group' => 'O-', 'total_units' => 1],
        ];

        foreach ($inventory as $item) {
            BloodInventory::updateOrCreate(['blood_group' => $item['blood_group']], $item);
        }
    }
}