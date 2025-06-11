<?php

require_once __DIR__ . '/vendor/autoload.php';

// Bootstrap Laravel
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "🔍 CHECKING DATABASE SAFETY BEFORE ANY CHANGES\n";
echo "==============================================\n\n";

try {
    // Check if we can connect to database
    $pdo = DB::connection()->getPdo();
    echo "✅ Database connection: SUCCESS\n\n";

    // Check existing tables
    $tables = DB::select("SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename");
    
    echo "📋 EXISTING TABLES (" . count($tables) . " total):\n";
    foreach ($tables as $table) {
        echo "   - {$table->tablename}\n";
    }
    echo "\n";

    // Check for important data
    $dataCheck = [
        'users' => 'SELECT COUNT(*) as count FROM users',
        'employees' => 'SELECT COUNT(*) as count FROM employees', 
        'plans' => 'SELECT COUNT(*) as count FROM plans',
        'subscriptions' => 'SELECT COUNT(*) as count FROM subscriptions',
        'orders' => 'SELECT COUNT(*) as count FROM orders',
    ];

    echo "📊 DATA COUNT CHECK:\n";
    foreach ($dataCheck as $tableName => $query) {
        try {
            $result = DB::select($query);
            $count = $result[0]->count ?? 0;
            $status = $count > 0 ? "⚠️  HAS DATA ({$count} records)" : "✅ Empty";
            echo "   - {$tableName}: {$status}\n";
        } catch (Exception $e) {
            echo "   - {$tableName}: ❌ Table not found\n";
        }
    }

    echo "\n";

    // Check pricing-specific tables
    $pricingTables = ['plans', 'payment_methods', 'subscriptions', 'orders'];
    $missingTables = [];
    
    echo "💰 PRICING TABLES CHECK:\n";
    foreach ($pricingTables as $table) {
        $exists = false;
        foreach ($tables as $existingTable) {
            if ($existingTable->tablename === $table) {
                $exists = true;
                break;
            }
        }
        
        if ($exists) {
            echo "   ✅ {$table} - EXISTS\n";
        } else {
            echo "   ❌ {$table} - MISSING\n";
            $missingTables[] = $table;
        }
    }

    echo "\n";

    // Safety recommendation
    if (count($missingTables) > 0) {
        echo "🔧 RECOMMENDATION:\n";
        echo "   - Missing pricing tables: " . implode(', ', $missingTables) . "\n";
        echo "   - Solution: Run only the missing migrations instead of migrate:fresh\n";
        echo "   - This will preserve your existing data\n\n";
    }

    // Check for any data that would be lost
    $hasImportantData = false;
    foreach ($dataCheck as $tableName => $query) {
        try {
            $result = DB::select($query);
            $count = $result[0]->count ?? 0;
            if ($count > 0) {
                $hasImportantData = true;
                break;
            }
        } catch (Exception $e) {
            // Table doesn't exist, that's ok
        }
    }

    if ($hasImportantData) {
        echo "⚠️  WARNING: migrate:fresh WILL DELETE ALL YOUR DATA!\n";
        echo "   - Use 'php artisan migrate' instead to preserve data\n";
        echo "   - Or backup your database first\n\n";
    } else {
        echo "✅ SAFE: No important data found - migrate:fresh is safe to use\n\n";
    }

} catch (Exception $e) {
    echo "❌ Error checking database: " . $e->getMessage() . "\n";
}
