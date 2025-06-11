<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->boot();

use App\Models\User;
use Illuminate\Support\Facades\Hash;

try {
    $user = User::create([
        'employee_id' => '1234567890123456',
        'role' => 'admin',
        'name' => 'Admin User',
        'mobile_phone' => '+6281234567890',
        'username' => 'admin',
        'email' => 'admin@cmlabs.com',
        'password' => Hash::make('password123'),
    ]);
    
    echo "Admin user created successfully with ID: " . $user->id_users . "\n";
    echo "Email: " . $user->email . "\n";
    echo "Role: " . $user->role . "\n";
} catch (Exception $e) {
    echo "Error creating user: " . $e->getMessage() . "\n";
}
