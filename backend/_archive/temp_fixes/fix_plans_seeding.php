<?php
/**
 * Fix Plans Seeding - Only Plans Related Tables
 */

require_once __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\DB;

echo "=== Fixing Plans Tables Seeding ===\n";

try {
    // First, check what columns exist in plans table
    $columns = DB::select("SELECT column_name FROM information_schema.columns WHERE table_name = 'plans' ORDER BY ordinal_position");
    $planColumns = array_column($columns, 'column_name');
    echo "Plans table has columns: " . implode(', ', $planColumns) . "\n\n";
    
    // Insert plans data with correct column names
    echo "🌱 Seeding plans table...\n";
    DB::statement("
        INSERT INTO plans (id, name, description, type, monthly_price, yearly_price, seat_price, currency, features, is_active) VALUES
        (1, 'Starter', 'Perfect for small teams getting started with HRIS', 'package', 0, 0, null, 'IDR', '[]', true),
        (2, 'Lite', 'Ideal for growing teams needing advanced features', 'package', 25000, 20000, null, 'IDR', '[]', true),
        (3, 'Pro', 'For enterprises needing full control and customization', 'package', 75000, 70000, null, 'IDR', '[]', true),
        (4, 'Standard Seat', 'Basic access for individual team members', 'seat', null, null, 5000, 'IDR', '[]', true),
        (5, 'Premium Seat', 'Enhanced access with advanced features', 'seat', null, null, 10000, 'IDR', '[]', true),
        (6, 'Enterprise Seat', 'Full feature access for power users', 'seat', null, null, 15000, 'IDR', '[]', true)
        ON CONFLICT (id) DO NOTHING
    ");
    echo "✅ Plans seeded!\n\n";
    
    // Check payment_methods columns and seed
    $columns = DB::select("SELECT column_name FROM information_schema.columns WHERE table_name = 'payment_methods' ORDER BY ordinal_position");
    $paymentColumns = array_column($columns, 'column_name');
    echo "Payment methods table has columns: " . implode(', ', $paymentColumns) . "\n\n";
    
    echo "🌱 Seeding payment methods...\n";
    DB::statement("
        INSERT INTO payment_methods (id, code, name, type, processing_fee, is_active) VALUES
        (1, 'visa', 'Visa', 'card', 2500, true),
        (2, 'mastercard', 'Mastercard', 'card', 2500, true),
        (3, 'bca', 'Bank Central Asia (BCA)', 'bank', 2500, true),
        (4, 'mandiri', 'Bank Mandiri', 'bank', 2500, true),
        (5, 'bni', 'Bank Negara Indonesia (BNI)', 'bank', 2500, true),
        (6, 'gopay', 'GoPay', 'digital_wallet', 1000, true),
        (7, 'dana', 'DANA', 'digital_wallet', 1000, true),
        (8, 'ovo', 'OVO', 'digital_wallet', 1000, true)
        ON CONFLICT (id) DO NOTHING
    ");
    echo "✅ Payment methods seeded!\n\n";
    
    // Verify the data
    echo "📊 Verification:\n";
    $planCount = DB::table('plans')->count();
    $paymentCount = DB::table('payment_methods')->count();
    echo "Plans: {$planCount} records\n";
    echo "Payment methods: {$paymentCount} records\n";
    
    if ($planCount > 0 && $paymentCount > 0) {
        echo "\n🎉 Plans feature database setup complete!\n";
    }
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}
