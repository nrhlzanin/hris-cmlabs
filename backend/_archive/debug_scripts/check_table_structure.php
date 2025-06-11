<?php
/**
 * Check table structure and fix seeding
 */

require_once __DIR__ . '/vendor/autoload.php';

// Bootstrap Laravel
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\DB;

echo "=== Checking Table Structure ===\n";

try {
    // Check plans table structure
    echo "Plans table columns:\n";
    $columns = DB::select("
        SELECT column_name, data_type, is_nullable, column_default 
        FROM information_schema.columns 
        WHERE table_name = 'plans' 
        ORDER BY ordinal_position
    ");
    
    foreach ($columns as $column) {
        echo "  - {$column->column_name} ({$column->data_type}) " . 
             ($column->is_nullable === 'YES' ? 'NULL' : 'NOT NULL') . "\n";
    }
    
    echo "\nPayment methods table columns:\n";
    $columns = DB::select("
        SELECT column_name, data_type, is_nullable 
        FROM information_schema.columns 
        WHERE table_name = 'payment_methods' 
        ORDER BY ordinal_position
    ");
    
    foreach ($columns as $column) {
        echo "  - {$column->column_name} ({$column->data_type}) " . 
             ($column->is_nullable === 'YES' ? 'NULL' : 'NOT NULL') . "\n";
    }
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}
