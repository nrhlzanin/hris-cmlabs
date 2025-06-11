<?php
/**
 * Simple Database Check
 */

// Include Laravel bootstrap
require_once __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\DB;

echo "=== Quick Database Check ===\n";

try {
    // Test connection
    DB::connection()->getPdo();
    echo "✓ Database connected\n";
    
    // Check key tables
    $keyTables = [
        'migrations',
        'users', 
        'personal_access_tokens',
        'plans',
        'payment_methods',
        'subscriptions',
        'orders',
        'plans_enhanced',
        'payment_methods_enhanced'
    ];
    
    echo "\nTable status:\n";
    foreach ($keyTables as $table) {
        try {
            $count = DB::table($table)->count();
            echo "✓ {$table}: {$count} records\n";
        } catch (Exception $e) {
            echo "✗ {$table}: missing\n";
        }
    }
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}

echo "\n=== Done ===\n";
