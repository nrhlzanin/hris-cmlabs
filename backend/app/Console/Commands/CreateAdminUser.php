<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class CreateAdminUser extends Command
{
    protected $signature = 'user:create-admin {email} {password}';
    protected $description = 'Create an admin user';

    public function handle()
    {
        $email = $this->argument('email');
        $password = $this->argument('password');

        try {
            $user = User::create([
                'employee_id' => '1234567890123456',
                'role' => 'admin',
                'name' => 'Admin User',
                'mobile_phone' => '+6281234567890',
                'username' => 'admin',
                'email' => $email,
                'password' => Hash::make($password),
            ]);

            $this->info("Admin user created successfully!");
            $this->info("Email: {$user->email}");
            $this->info("Role: {$user->role}");
            $this->info("ID: {$user->id_users}");
        } catch (\Exception $e) {
            $this->error("Error creating user: " . $e->getMessage());
        }
    }
}
