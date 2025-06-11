<?php
/**
 * Supabase Database Restoration Script
 * Run this to restore all missing tables in your Supabase database
 */

require_once __DIR__ . '/vendor/autoload.php';

// Bootstrap Laravel
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Artisan;

echo "🔄 Starting Supabase Database Restoration...\n\n";

try {
    // Test database connection
    echo "📡 Testing Supabase connection...\n";
    DB::connection()->getPdo();
    echo "✅ Supabase connection successful!\n\n";
    
    // Check if migrations table exists
    echo "🔍 Checking migrations table...\n";
    if (!Schema::hasTable('migrations')) {
        echo "⚠️  Migrations table missing. Creating...\n";
        Artisan::call('migrate:install');
        echo "✅ Migrations table created!\n";
    } else {
        echo "✅ Migrations table exists!\n";
    }
    
    // Get migration status
    echo "\n📋 Current migration status:\n";
    $result = Artisan::call('migrate:status');
    echo Artisan::output();
    
    // Run fresh migrations with seeding
    echo "\n🚀 Running fresh migrations with seeding...\n";
    $result = Artisan::call('migrate:fresh', ['--seed' => true]);
    echo Artisan::output();
    
    if ($result === 0) {
        echo "\n✅ Database restoration completed successfully!\n";
        
        // Verify important tables
        echo "\n🔍 Verifying critical tables...\n";
        $criticalTables = [
            'users',
            'personal_access_tokens',
            'plans',
            'payment_methods', 
            'subscriptions',
            'orders',
            'plans_enhanced',
            'payment_methods_enhanced',
            'subscriptions_enhanced',
            'orders_enhanced'
        ];
        
        $missingTables = [];
        foreach ($criticalTables as $table) {
            if (Schema::hasTable($table)) {
                echo "✅ {$table} - OK\n";
            } else {
                echo "❌ {$table} - MISSING\n";
                $missingTables[] = $table;
            }
        }
        
        if (empty($missingTables)) {
            echo "\n🎉 All critical tables are present!\n";
            
            // Show table counts
            echo "\n📊 Table record counts:\n";
            foreach ($criticalTables as $table) {
                if (Schema::hasTable($table)) {
                    $count = DB::table($table)->count();
                    echo "📋 {$table}: {$count} records\n";
                }
            }
        } else {
            echo "\n⚠️  Some tables are still missing: " . implode(', ', $missingTables) . "\n";
        }
        
    } else {
        echo "\n❌ Migration failed!\n";
    }
    
} catch (Exception $e) {
    echo "\n❌ Error: " . $e->getMessage() . "\n";
    echo "📋 Stack trace:\n" . $e->getTraceAsString() . "\n";
}

echo "\n🏁 Script completed!\n";
