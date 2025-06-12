<?php

require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\CheckClock;

echo "=== DEBUG: CheckClock Records ===\n\n";

// Get all records with their details
$allRecords = CheckClock::with('user')
    ->orderBy('created_at', 'desc')
    ->take(10)
    ->get(['id', 'user_id', 'check_clock_type', 'approval_status', 'created_at']);

echo "Recent CheckClock Records:\n";
foreach ($allRecords as $record) {
    echo "ID: {$record->id}, User: {$record->user_id}, Type: {$record->check_clock_type}, Status: {$record->approval_status}, Date: {$record->created_at}\n";
}

echo "\n--- Pending Records ---\n";
$pendingRecords = CheckClock::where('approval_status', 'pending')->get(['id', 'user_id', 'check_clock_type', 'created_at']);
foreach ($pendingRecords as $record) {
    echo "Pending ID: {$record->id}, User: {$record->user_id}, Type: {$record->check_clock_type}, Date: {$record->created_at}\n";
}

echo "\n--- Approved Records ---\n";
$approvedRecords = CheckClock::where('approval_status', 'approved')->get(['id', 'user_id', 'check_clock_type', 'created_at']);
foreach ($approvedRecords as $record) {
    echo "Approved ID: {$record->id}, User: {$record->user_id}, Type: {$record->check_clock_type}, Date: {$record->created_at}\n";
}

echo "\nTotal records: " . CheckClock::count() . "\n";
echo "Pending: " . CheckClock::where('approval_status', 'pending')->count() . "\n";
echo "Approved: " . CheckClock::where('approval_status', 'approved')->count() . "\n";
echo "Declined: " . CheckClock::where('approval_status', 'declined')->count() . "\n";
