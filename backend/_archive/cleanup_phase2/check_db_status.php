<?php
/**
 * Quick Database Status Check
 */

require_once __DIR__ . '/vendor/autoload.php';

// Bootstrap Laravel
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\DB;

echo "=== Supabase Database Status ===\n";

try {
    // Test connection
    echo "Testing connection...\n";
    $pdo = DB::connection()->getPdo();
    echo "✓ Connected to: " . $pdo->getAttribute(PDO::ATTR_SERVER_INFO) . "\n\n";
    
    // Get all tables
    echo "Existing tables:\n";
    $tables = DB::select("
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        ORDER BY table_name
    ");
    
    foreach ($tables as $table) {
        $count = DB::table($table->table_name)->count();
        echo "  📋 {$table->table_name}: {$count} records\n";
    }
    
    echo "\nMigration status:\n";
    $migrations = DB::table('migrations')->orderBy('batch')->get();
    foreach ($migrations as $migration) {
        echo "  ✓ {$migration->migration} (batch {$migration->batch})\n";
    }
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}
