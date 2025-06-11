<?php

require_once 'vendor/autoload.php';

// Load Laravel application
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\Overtime;
use App\Models\User;
use Carbon\Carbon;

// Get the test user
$user = User::where('email', 'user1test@gmail.com')->first();

if (!$user) {
    echo "User not found. Please create a user first.\n";
    exit;
}

echo "Creating sample overtime records for user: {$user->name}\n";

// Create sample overtime records like in the image
$overtimeData = [
    [
        'user_id' => $user->id_users,
        'overtime_date' => '2025-08-19',
        'start_time' => '17:45:00',
        'end_time' => '20:30:00',
        'duration_hours' => 2.75,
        'overtime_type' => 'regular',
        'reason' => 'Pak, butuh saya makan pak.',
        'tasks_completed' => 'Completed urgent project documentation and client presentation preparation.',
        'status' => 'pending',
        'created_at' => Carbon::create(2025, 8, 19, 17, 45, 0),
        'updated_at' => Carbon::create(2025, 8, 19, 20, 30, 0),
    ],
    [
        'user_id' => $user->id_users,
        'overtime_date' => '2025-08-10',
        'start_time' => '18:00:00',
        'end_time' => '21:00:00',
        'duration_hours' => 3.0,
        'overtime_type' => 'regular',
        'reason' => 'Revision',
        'tasks_completed' => 'Completed code review and bug fixes for mobile application.',
        'status' => 'approved',
        'created_at' => Carbon::create(2025, 8, 10, 18, 0, 0),
        'updated_at' => Carbon::create(2025, 8, 10, 21, 0, 0),
    ],
    [
        'user_id' => $user->id_users,
        'overtime_date' => '2025-06-15',
        'start_time' => '17:30:00',
        'end_time' => '20:00:00',
        'duration_hours' => 2.5,
        'overtime_type' => 'regular',
        'reason' => 'Database migration and testing for new features.',
        'tasks_completed' => 'Successfully migrated production database and performed comprehensive testing.',
        'status' => 'approved',
        'created_at' => Carbon::create(2025, 6, 15, 17, 30, 0),
        'updated_at' => Carbon::create(2025, 6, 15, 20, 0, 0),
    ],
    [
        'user_id' => $user->id_users,
        'overtime_date' => '2025-06-12',
        'start_time' => '18:00:00',
        'end_time' => null, // Pending completion
        'duration_hours' => null,
        'overtime_type' => 'regular',
        'reason' => 'API Test - Complete urgent project tasks',
        'tasks_completed' => null,
        'status' => 'pending',
        'created_at' => Carbon::create(2025, 6, 12, 18, 0, 0),
        'updated_at' => Carbon::create(2025, 6, 12, 18, 0, 0),
    ]
];

// Clear existing overtime records for this user
Overtime::where('user_id', $user->id_users)->delete();

$created = 0;
foreach ($overtimeData as $data) {
    try {
        Overtime::create($data);
        $created++;
        echo "✅ Created overtime record for {$data['overtime_date']} - {$data['reason']}\n";
    } catch (Exception $e) {
        echo "❌ Failed to create overtime record: {$e->getMessage()}\n";
    }
}

echo "\n🎉 Successfully created {$created} overtime records!\n";
echo "🔗 You can now view them at: http://localhost:3010/user/overtime\n";

// Display created records
$records = Overtime::where('user_id', $user->id_users)
    ->orderBy('overtime_date', 'desc')
    ->get();

echo "\n📊 Overtime Records Summary:\n";
echo "=" . str_repeat("=", 50) . "\n";
foreach ($records as $record) {
    $status = strtoupper($record->status);
    $date = $record->overtime_date;
    $duration = $record->duration_hours ? "{$record->duration_hours}h" : "Pending";
    echo "📅 {$date} | ⏱️ {$duration} | 🏷️ {$status} | 📝 {$record->reason}\n";
}
echo "=" . str_repeat("=", 50) . "\n";
