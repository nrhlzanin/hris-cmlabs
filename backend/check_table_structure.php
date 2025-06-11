<?php
require_once 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "🔍 Checking Employees Table Structure in Supabase\n\n";

try {
    $columns = DB::select("SELECT column_name, data_type, is_nullable 
                          FROM information_schema.columns 
                          WHERE table_name = 'employees' 
                          ORDER BY ordinal_position");
    
    echo "📋 Employees Table Columns:\n";
    echo str_repeat("-", 50) . "\n";
    
    foreach ($columns as $column) {
        echo sprintf("%-20s | %-15s | %s\n", 
            $column->column_name, 
            $column->data_type,
            $column->is_nullable === 'YES' ? 'NULL' : 'NOT NULL'
        );
    }
    
    echo "\n";
    
    // Check primary key
    $primaryKey = DB::select("SELECT column_name 
                             FROM information_schema.key_column_usage 
                             WHERE table_name = 'employees' 
                             AND constraint_name LIKE '%_pkey'");
    
    if ($primaryKey) {
        echo "🔑 Primary Key: " . $primaryKey[0]->column_name . "\n";
    }
    
    // Sample data structure from existing records
    $sample = DB::table('employees')->first();
    if ($sample) {
        echo "\n📄 Sample Employee Record Structure:\n";
        echo str_repeat("-", 50) . "\n";
        foreach ($sample as $key => $value) {
            echo sprintf("%-20s: %s\n", $key, $value);
        }
    }
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}
?>
