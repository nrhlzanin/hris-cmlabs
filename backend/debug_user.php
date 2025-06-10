<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->boot();

use App\Models\User;
use App\Models\Employee;

try {
    echo "Testing user access...\n";
    
    $user = User::where('email', 'test@test.com')->first();
    
    if (!$user) {
        echo "User not found!\n";
        exit;
    }
    
    echo "User found: {$user->name}\n";
    echo "Employee ID: {$user->employee_id}\n";
    
    $employee = $user->employee;
    
    if ($employee) {
        echo "Employee name: {$employee->first_name} {$employee->last_name}\n";
        echo "Employee NIK: {$employee->nik}\n";
        echo "Employee position: {$employee->position}\n";
    } else {
        echo "Employee relationship is null!\n";
    }
    
    // Test the method that's failing
    echo "\nTesting getUserProfile method...\n";
    $authService = new \App\Services\AuthService();
    $profile = $authService->getUserProfile($user);
    echo "Profile retrieved successfully!\n";
    echo "User role: {$profile['user']['role']}\n";
    echo "Employee full name: " . ($profile['employee']['full_name'] ?? 'null') . "\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . "\n";
    echo "Line: " . $e->getLine() . "\n";
    echo "Stack trace:\n" . $e->getTraceAsString() . "\n";
}
