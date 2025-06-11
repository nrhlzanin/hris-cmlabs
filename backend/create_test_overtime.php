<?php
// Simple script to create test overtime data
require_once __DIR__ . '/vendor/autoload.php';

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

// Load Laravel environment
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

try {
    echo "Creating test overtime data...\n";
    
    // Get the test user
    $user = DB::table('users')->where('email', 'test@test.com')->first();
    
    if (!$user) {
        echo "❌ Test user not found\n";
        exit(1);
    }
    
    echo "✅ Found test user: {$user->name}\n";
      // Create test overtime records
    $overtimeData = [
        [
            'user_id' => $user->id_users,
            'overtime_date' => Carbon::now()->subDays(3)->format('Y-m-d'),
            'start_time' => '18:00:00',
            'end_time' => '20:00:00',
            'duration_hours' => 2.0,
            'reason' => 'Complete project documentation and code review',
            'tasks_completed' => 'Finished all documentation, performed code review, and prepared deployment notes',
            'status' => 'approved',
            'approved_by' => $user->id_users, // Self-approved for testing
            'approved_at' => Carbon::now()->subDays(2),
            'created_at' => Carbon::now()->subDays(3),
            'updated_at' => Carbon::now()->subDays(2),
        ],
        [
            'user_id' => $user->id_users,
            'overtime_date' => Carbon::now()->subDays(1)->format('Y-m-d'),
            'start_time' => '17:30:00',
            'end_time' => null,
            'duration_hours' => 0.0,
            'reason' => 'Emergency system maintenance and monitoring',
            'tasks_completed' => null,
            'status' => 'pending',
            'approved_by' => null,
            'approved_at' => null,
            'created_at' => Carbon::now()->subDays(1),
            'updated_at' => Carbon::now()->subDays(1),
        ],
        [
            'user_id' => $user->id_users,
            'overtime_date' => Carbon::now()->format('Y-m-d'),
            'start_time' => '19:00:00',
            'end_time' => null,
            'duration_hours' => 0.0,
            'reason' => 'Database optimization and performance tuning',
            'tasks_completed' => null,
            'status' => 'approved',
            'approved_by' => $user->id_users,
            'approved_at' => Carbon::now()->subHours(2),
            'created_at' => Carbon::now()->subHours(3),
            'updated_at' => Carbon::now()->subHours(2),
        ]
    ];
      // Clear existing test data
    DB::table('overtimes')->where('user_id', $user->id_users)->delete();
    echo "🧹 Cleared existing test overtime data\n";
    
    // Insert new test data
    foreach ($overtimeData as $data) {
        $id = DB::table('overtimes')->insertGetId($data);
        echo "✅ Created overtime record ID: {$id} - {$data['reason']}\n";
    }
    
    echo "\n🎉 Test overtime data created successfully!\n";
    echo "📊 Total records: " . count($overtimeData) . "\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
