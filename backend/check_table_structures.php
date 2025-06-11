<?php

require_once __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "🔍 CHECKING TABLE STRUCTURES - NON-PRICING TABLES\n";
echo "================================================\n\n";

// Check existing non-pricing tables
$existingTables = ['users', 'employees', 'check_clocks', 'check_clock_settings', 'letters', 'letter_formats'];

foreach ($existingTables as $tableName) {
    try {
        echo "📋 TABLE: {$tableName}\n";
        
        // Get column information
        $columns = DB::select("
            SELECT column_name, data_type, is_nullable, column_default 
            FROM information_schema.columns 
            WHERE table_name = ? 
            ORDER BY ordinal_position
        ", [$tableName]);
        
        if (empty($columns)) {
            echo "   ❌ Table not found or no columns\n\n";
            continue;
        }
        
        foreach ($columns as $column) {
            $nullable = $column->is_nullable === 'YES' ? 'NULL' : 'NOT NULL';
            $default = $column->column_default ? " DEFAULT: {$column->column_default}" : '';
            echo "   - {$column->column_name} ({$column->data_type}) {$nullable}{$default}\n";
        }
        
        echo "\n";
        
    } catch (Exception $e) {
        echo "   ❌ Error checking {$tableName}: " . $e->getMessage() . "\n\n";
    }
}

echo "📋 PRICING TABLES (NEW):\n";
$pricingTables = ['plans', 'payment_methods', 'subscriptions', 'orders'];

foreach ($pricingTables as $tableName) {
    try {
        echo "💰 TABLE: {$tableName}\n";
        
        $columns = DB::select("
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = ? 
            ORDER BY ordinal_position
        ", [$tableName]);
        
        if (empty($columns)) {
            echo "   ❌ Table not found\n\n";
            continue;
        }
        
        foreach ($columns as $column) {
            echo "   - {$column->column_name} ({$column->data_type})\n";
        }
        
        echo "\n";
        
    } catch (Exception $e) {
        echo "   ❌ Error checking {$tableName}: " . $e->getMessage() . "\n\n";
    }
}
