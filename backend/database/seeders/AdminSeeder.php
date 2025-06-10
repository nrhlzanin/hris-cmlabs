<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Employee;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Super Admin
        $superAdminEmployee = Employee::create([
            'nik' => '1234567890123456', // 16 digit NIK
            'first_name' => 'Super',
            'last_name' => 'Admin',
            'mobile_phone' => '+6281234567890',
            'gender' => 'Men',
            'last_education' => 'S1',
            'place_of_birth' => 'Jakarta',
            'date_of_birth' => '1990-01-15',
            'position' => 'Super Administrator',
            'branch' => 'Head Office',
            'contract_type' => 'Permanent',
            'grade' => 'Executive',
            'bank' => 'BCA',
            'account_number' => '1234567890',
            'acc_holder_name' => 'Super Admin',
        ]);

        User::create([
            'employee_id' => $superAdminEmployee->nik,
            'role' => 'super_admin',
            'name' => $superAdminEmployee->first_name . ' ' . $superAdminEmployee->last_name,
            'mobile_phone' => $superAdminEmployee->mobile_phone,
            'username' => 'superadmin',
            'email' => 'superadmin@hris.com',
            'email_verified_at' => now(),
            'password' => Hash::make('SuperAdmin123#'),
            'is_active' => true,
        ]);

        // Create Regular Admin
        $adminEmployee = Employee::create([
            'nik' => '1234567890123457', // 16 digit NIK
            'first_name' => 'Admin',
            'last_name' => 'User',
            'mobile_phone' => '+6281234567891',
            'gender' => 'Woman',
            'last_education' => 'S1',
            'place_of_birth' => 'Bandung',
            'date_of_birth' => '1992-03-20',
            'position' => 'Administrator',
            'branch' => 'Head Office',
            'contract_type' => 'Permanent',
            'grade' => 'Senior',
            'bank' => 'BNI',
            'account_number' => '1234567891',
            'acc_holder_name' => 'Admin User',
        ]);

        User::create([
            'employee_id' => $adminEmployee->nik,
            'role' => 'admin',
            'name' => $adminEmployee->first_name . ' ' . $adminEmployee->last_name,
            'mobile_phone' => $adminEmployee->mobile_phone,
            'username' => 'admin',
            'email' => 'admin@hris.com',
            'email_verified_at' => now(),
            'password' => Hash::make('Admin123#'),
            'is_active' => true,
        ]);

        // Create HR Manager (Admin role)
        $hrEmployee = Employee::create([
            'nik' => '1234567890123458', // 16 digit NIK
            'first_name' => 'HR',
            'last_name' => 'Manager',
            'mobile_phone' => '+6281234567892',
            'gender' => 'Woman',
            'last_education' => 'S2',
            'place_of_birth' => 'Surabaya',
            'date_of_birth' => '1988-07-10',
            'position' => 'HR Manager',
            'branch' => 'Head Office',
            'contract_type' => 'Permanent',
            'grade' => 'Manager',
            'bank' => 'Mandiri',
            'account_number' => '1234567892',
            'acc_holder_name' => 'HR Manager',
        ]);

        User::create([
            'employee_id' => $hrEmployee->nik,
            'role' => 'admin',
            'name' => $hrEmployee->first_name . ' ' . $hrEmployee->last_name,
            'mobile_phone' => $hrEmployee->mobile_phone,
            'username' => 'hrmanager',
            'email' => 'hr.manager@hris.com',
            'email_verified_at' => now(),
            'password' => Hash::make('HRManager123#'),
            'is_active' => true,
        ]);

        // Create IT Admin (Super Admin role)
        $itEmployee = Employee::create([
            'nik' => '1234567890123459', // 16 digit NIK
            'first_name' => 'IT',
            'last_name' => 'Administrator',
            'mobile_phone' => '+6281234567893',
            'gender' => 'Men',
            'last_education' => 'S1',
            'place_of_birth' => 'Yogyakarta',
            'date_of_birth' => '1995-11-25',
            'position' => 'IT Administrator',
            'branch' => 'Head Office',
            'contract_type' => 'Permanent',
            'grade' => 'Senior',
            'bank' => 'BRI',
            'account_number' => '1234567893',
            'acc_holder_name' => 'IT Administrator',
        ]);

        User::create([
            'employee_id' => $itEmployee->nik,
            'role' => 'super_admin',
            'name' => $itEmployee->first_name . ' ' . $itEmployee->last_name,
            'mobile_phone' => $itEmployee->mobile_phone,
            'username' => 'itadmin',
            'email' => 'it.admin@hris.com',
            'email_verified_at' => now(),
            'password' => Hash::make('ITAdmin123#'),
            'is_active' => true,
        ]);

        // Create Branch Manager (Admin role)
        $branchEmployee = Employee::create([
            'nik' => '1234567890123460', // 16 digit NIK
            'first_name' => 'Branch',
            'last_name' => 'Manager',
            'mobile_phone' => '+6281234567894',
            'gender' => 'Men',
            'last_education' => 'S1',
            'place_of_birth' => 'Medan',
            'date_of_birth' => '1987-12-05',
            'position' => 'Branch Manager',
            'branch' => 'Medan Branch',
            'contract_type' => 'Permanent',
            'grade' => 'Manager',
            'bank' => 'BSI',
            'account_number' => '1234567894',
            'acc_holder_name' => 'Branch Manager',
        ]);

        User::create([
            'employee_id' => $branchEmployee->nik,
            'role' => 'admin',
            'name' => $branchEmployee->first_name . ' ' . $branchEmployee->last_name,
            'mobile_phone' => $branchEmployee->mobile_phone,
            'username' => 'branchmanager',
            'email' => 'branch.manager@hris.com',
            'email_verified_at' => now(),
            'password' => Hash::make('BranchManager123#'),
            'is_active' => true,
        ]);

        $this->command->info('Admin users created successfully!');
        $this->command->line('');
        $this->command->info('Login Credentials:');
        $this->command->line('====================');
        $this->command->info('Super Admin:');
        $this->command->line('  Email: superadmin@hris.com');
        $this->command->line('  Username: superadmin');
        $this->command->line('  Password: SuperAdmin123#');
        $this->command->line('');
        $this->command->info('Admin:');
        $this->command->line('  Email: admin@hris.com');
        $this->command->line('  Username: admin');
        $this->command->line('  Password: Admin123#');
        $this->command->line('');
        $this->command->info('HR Manager:');
        $this->command->line('  Email: hr.manager@hris.com');
        $this->command->line('  Username: hrmanager');
        $this->command->line('  Password: HRManager123#');
        $this->command->line('');
        $this->command->info('IT Admin:');
        $this->command->line('  Email: it.admin@hris.com');
        $this->command->line('  Username: itadmin');
        $this->command->line('  Password: ITAdmin123#');
        $this->command->line('');
        $this->command->info('Branch Manager:');
        $this->command->line('  Email: branch.manager@hris.com');
        $this->command->line('  Username: branchmanager');
        $this->command->line('  Password: BranchManager123#');
    }
}
