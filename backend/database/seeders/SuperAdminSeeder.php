<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Employee;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class SuperAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * Creates a single super admin for emergency access
     */
    public function run(): void
    {
        // Check if super admin already exists
        $existingSuperAdmin = User::where('role', 'super_admin')->first();
        
        if ($existingSuperAdmin) {
            $this->command->warn('Super admin already exists!');
            return;
        }

        // Create Emergency Super Admin
        $superAdminEmployee = Employee::create([
            'nik' => '0000000000000001', // Emergency NIK
            'first_name' => 'System',
            'last_name' => 'Administrator',
            'mobile_phone' => '+6200000000000',
            'gender' => 'Men',
            'last_education' => 'S2',
            'place_of_birth' => 'Jakarta',
            'date_of_birth' => '1985-01-01',
            'position' => 'System Administrator',
            'branch' => 'System',
            'contract_type' => 'Permanent',
            'grade' => 'System',
            'bank' => 'BCA',
            'account_number' => '0000000000',
            'acc_holder_name' => 'System Administrator',
        ]);

        User::create([
            'employee_id' => $superAdminEmployee->nik,
            'role' => 'super_admin',
            'name' => $superAdminEmployee->first_name . ' ' . $superAdminEmployee->last_name,
            'mobile_phone' => $superAdminEmployee->mobile_phone,
            'username' => 'sysadmin',
            'email' => 'sysadmin@hris.com',
            'email_verified_at' => now(),
            'password' => Hash::make('SysAdmin2025!'),
            'is_active' => true,
        ]);

        $this->command->info('Emergency Super Admin created successfully!');
        $this->command->line('');
        $this->command->info('Emergency Login Credentials:');
        $this->command->line('=============================');
        $this->command->info('Email: sysadmin@hris.com');
        $this->command->info('Username: sysadmin');
        $this->command->info('Password: SysAdmin2025!');
        $this->command->line('');
        $this->command->warn('⚠️  Please change this password after first login!');
    }
}
