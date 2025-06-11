<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\Employee;
use Illuminate\Support\Facades\Hash;

class CreateTestUser extends Command
{
    protected $signature = 'user:create-test';
    protected $description = 'Create a test user for debugging';

    public function handle()
    {
        try {
            // First create the employee record
            $employee = Employee::firstOrCreate([
                'nik' => '9999999999999999'
            ], [
                'first_name' => 'Test',
                'last_name' => 'User',
                'mobile_phone' => '+6281234567999',
                'gender' => 'Men',
                'last_education' => 'S1',
                'place_of_birth' => 'Jakarta',
                'date_of_birth' => '1990-01-01',
                'position' => 'Test Position',
                'branch' => 'Test Branch',
                'contract_type' => 'Permanent',
                'grade' => 'Test Grade',
                'bank' => 'BCA',
                'account_number' => '1234567890',
                'acc_holder_name' => 'Test User',
            ]);

            // Then create the user record
            $user = User::firstOrCreate([
                'email' => 'test@test.com'
            ], [
                'employee_id' => '9999999999999999',
                'role' => 'user',
                'name' => 'Test User',
                'mobile_phone' => '+6281234567999',
                'username' => 'testuser',
                'password' => Hash::make('test123'),
            ]);

            $this->info("Test user created successfully!");
            $this->info("Email: test@test.com");
            $this->info("Password: test123");
            $this->info("User ID: {$user->id_users}");
            $this->info("Employee NIK: {$employee->nik}");
        } catch (\Exception $e) {
            $this->error("Error creating test user: " . $e->getMessage());
        }
    }
}
