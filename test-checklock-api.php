<?php
require_once __DIR__ . '/backend/vendor/autoload.php';

use App\Models\User;
use App\Models\CheckClock;

// Test the CheckClock API endpoint functionality
echo "=== Testing CheckClock API ===\n";

// Find an admin user
$adminUser = User::where('role', 'admin')->first();
if (!$adminUser) {
    echo "No admin user found. Creating one...\n";
    // You might want to create an admin user here if needed
    exit(1);
}

echo "Admin user found: {$adminUser->name} (ID: {$adminUser->id_users})\n";

// Get all checklock records
$checkClocks = CheckClock::with('user.employee')->latest()->limit(5)->get();
echo "\nLatest 5 CheckClock records:\n";

foreach ($checkClocks as $record) {
    $userName = $record->user->employee 
        ? "{$record->user->employee->first_name} {$record->user->employee->last_name}"
        : $record->user->name;
    
    echo "- ID: {$record->id}, User: {$userName}, Type: {$record->check_clock_type}, Time: {$record->check_clock_time}\n";
}

// Test pagination
$paginatedRecords = CheckClock::with('user.employee')->paginate(2);
echo "\nPagination test (2 per page):\n";
echo "Total: {$paginatedRecords->total()}\n";
echo "Current Page: {$paginatedRecords->currentPage()}\n";
echo "Last Page: {$paginatedRecords->lastPage()}\n";
echo "Has More Pages: " . ($paginatedRecords->hasMorePages() ? 'Yes' : 'No') . "\n";

echo "\n=== Test completed ===\n";
