<?php
/**
 * Quick table structure check
 */

require_once __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\DB;

echo "=== Table Structure Analysis ===\n\n";

// Check plans table
echo "PLANS TABLE:\n";
$columns = DB::select("SELECT column_name FROM information_schema.columns WHERE table_name = 'plans' ORDER BY ordinal_position");
foreach ($columns as $col) {
    echo "  - {$col->column_name}\n";
}

echo "\nPAYMENT_METHODS TABLE:\n";
$columns = DB::select("SELECT column_name FROM information_schema.columns WHERE table_name = 'payment_methods' ORDER BY ordinal_position");
foreach ($columns as $col) {
    echo "  - {$col->column_name}\n";
}

// Check if enhanced tables exist
echo "\nCHECKING ENHANCED TABLES:\n";
$tables = ['plans_enhanced', 'payment_methods_enhanced', 'subscriptions_enhanced', 'orders_enhanced'];
foreach ($tables as $table) {
    $exists = DB::select("SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = '{$table}')");
    echo "  - {$table}: " . ($exists[0]->exists ? "EXISTS" : "NOT EXISTS") . "\n";
}
