<?php
/**
 * Drop Enhanced Tables from Supabase
 * Removes unused enhanced tables to clean up database
 */

require_once __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\DB;

echo "🗑️ Dropping Enhanced Tables from Supabase...\n\n";

$enhancedTables = [
    'subscription_usage',
    'plan_features', 
    'orders_enhanced',
    'subscriptions_enhanced',
    'payment_methods_enhanced',
    'plans_enhanced'
];

try {
    foreach ($enhancedTables as $table) {
        echo "Checking {$table}...\n";
        
        // Check if table exists
        $exists = DB::select("SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = '{$table}')");
        
        if ($exists[0]->exists) {
            echo "  - Dropping {$table}...\n";
            DB::statement("DROP TABLE IF EXISTS {$table} CASCADE");
            echo "  ✅ {$table} dropped\n";
        } else {
            echo "  ➖ {$table} doesn't exist\n";
        }
    }
    
    echo "\n🎉 Enhanced tables cleanup completed!\n";
    
    // Verify remaining tables
    echo "\n📋 Remaining plans-related tables:\n";
    $remainingTables = ['plans', 'payment_methods', 'subscriptions', 'orders'];
    
    foreach ($remainingTables as $table) {
        $exists = DB::select("SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = '{$table}')");
        if ($exists[0]->exists) {
            $count = DB::table($table)->count();
            echo "  ✅ {$table}: {$count} records\n";
        }
    }
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}
