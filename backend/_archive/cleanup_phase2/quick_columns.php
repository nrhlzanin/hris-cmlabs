<?php
require_once __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\DB;

// Quick check of table columns
$tables = ['plans', 'payment_methods'];

foreach ($tables as $table) {
    echo "=== {$table} table ===\n";
    try {
        $columns = DB::select("SELECT column_name FROM information_schema.columns WHERE table_name = ? ORDER BY ordinal_position", [$table]);
        foreach ($columns as $col) {
            echo "- {$col->column_name}\n";
        }
    } catch (Exception $e) {
        echo "Error: {$e->getMessage()}\n";
    }
    echo "\n";
}
