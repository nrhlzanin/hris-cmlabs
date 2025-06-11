<?php
/**
 * Check EnhancedPlansSeeder compatibility with current database
 */

require_once __DIR__ . '/vendor/autoload.php';

// Bootstrap Laravel
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

echo "=== EnhancedPlansSeeder Compatibility Check ===\n";

try {
    // Check what tables exist
    echo "📋 Existing tables:\n";
    $tables = DB::select("
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        ORDER BY table_name
    ");
    
    foreach ($tables as $table) {
        echo "  ✓ {$table->table_name}\n";
    }
    
    // Check what the seeder expects vs what exists
    echo "\n🔍 Seeder Compatibility Analysis:\n";
    
    $seederExpects = [
        'plans_enhanced' => 'Enhanced plans table',
        'payment_methods_enhanced' => 'Enhanced payment methods table', 
        'plan_features' => 'Plan features table'
    ];
    
    $regularTables = [
        'plans' => 'Regular plans table',
        'payment_methods' => 'Regular payment methods table'
    ];
    
    foreach ($seederExpects as $table => $description) {
        if (Schema::hasTable($table)) {
            echo "  ✅ {$table} - EXISTS ({$description})\n";
        } else {
            echo "  ❌ {$table} - MISSING ({$description})\n";
        }
    }
    
    echo "\n📊 Regular tables (current):\n";
    foreach ($regularTables as $table => $description) {
        if (Schema::hasTable($table)) {
            $count = DB::table($table)->count();
            echo "  ✅ {$table} - EXISTS with {$count} records ({$description})\n";
        } else {
            echo "  ❌ {$table} - MISSING ({$description})\n";
        }
    }
    
    // Check column compatibility
    if (Schema::hasTable('plans')) {
        echo "\n🔧 Plans table column analysis:\n";
        $columns = DB::select("
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'plans' 
            ORDER BY ordinal_position
        ");
        
        $seederColumns = [
            'slug', 'short_description', 'price_monthly', 'price_yearly', 
            'price_per_seat', 'feature_limits', 'max_users', 'max_storage_gb',
            'is_recommended', 'is_popular', 'is_featured', 'badge_text',
            'button_variant', 'yearly_discount_percent', 'trial_days',
            'min_seats', 'max_seats'
        ];
        
        $existingColumns = array_map(fn($col) => $col->column_name, $columns);
        
        foreach ($seederColumns as $col) {
            if (in_array($col, $existingColumns)) {
                echo "    ✅ {$col}\n";
            } else {
                echo "    ❌ {$col} - MISSING\n";
            }
        }
    }
    
    echo "\n💡 DIAGNOSIS:\n";
    
    if (Schema::hasTable('plans_enhanced')) {
        echo "  • EnhancedPlansSeeder targets 'plans_enhanced' table ✅\n";
        echo "  • This seeder should work correctly\n";
    } else {
        echo "  • EnhancedPlansSeeder targets 'plans_enhanced' table ❌\n";
        echo "  • You have 'plans' table instead\n";
        echo "  • PROBLEM: Table name mismatch!\n";
        echo "\n🔧 SOLUTIONS:\n";
        echo "    1. Run enhanced migration to create 'plans_enhanced' table\n";
        echo "    2. OR modify seeder to use 'plans' table\n";
        echo "    3. OR use PlansSeeder.php instead\n";
    }
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}
