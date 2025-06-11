<?php
/**
 * Fixed Plans Seeding - Only touches plans-related tables
 */

require_once __DIR__ . '/vendor/autoload.php';

// Bootstrap Laravel
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\DB;

echo "=== Fixed Plans Seeding (Plans Only) ===\n";

try {
    // First, let's check what columns actually exist in plans table
    echo "📋 Checking plans table structure...\n";
    $plansColumns = DB::select("
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'plans' 
        ORDER BY ordinal_position
    ");
    
    echo "Plans table columns: ";
    foreach ($plansColumns as $col) {
        echo $col->column_name . " ";
    }
    echo "\n\n";
    
    // Check payment_methods table structure
    echo "📋 Checking payment_methods table structure...\n";
    $paymentColumns = DB::select("
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'payment_methods' 
        ORDER BY ordinal_position
    ");
    
    echo "Payment methods table columns: ";
    foreach ($paymentColumns as $col) {
        echo $col->column_name . " ";
    }
    echo "\n\n";
    
    // Now seed plans data based on actual columns
    echo "🌱 Seeding plans data (using actual column names)...\n";
    
    // Clear existing data first
    DB::table('plans')->truncate();
    
    // Check if we have monthly_price or price_monthly columns
    $hasMonthlyPrice = collect($plansColumns)->contains(fn($col) => $col->column_name === 'monthly_price');
    $hasPriceMonthly = collect($plansColumns)->contains(fn($col) => $col->column_name === 'price_monthly');
    $hasSeatPrice = collect($plansColumns)->contains(fn($col) => $col->column_name === 'seat_price');
    $hasPriceSeat = collect($plansColumns)->contains(fn($col) => $col->column_name === 'price_per_seat');
    
    echo "Column detection: monthly_price=$hasMonthlyPrice, price_monthly=$hasPriceMonthly, seat_price=$hasSeatPrice, price_per_seat=$hasPriceSeat\n";
    
    if ($hasMonthlyPrice) {
        // Use monthly_price, yearly_price, seat_price format
        DB::statement("
            INSERT INTO plans (id, name, description, type, monthly_price, yearly_price, seat_price, currency, features, is_active, created_at, updated_at) VALUES
            (1, 'Starter', 'Perfect for small teams getting started with HRIS', 'package', 0, 0, null, 'IDR', '[]', true, NOW(), NOW()),
            (2, 'Lite', 'Ideal for growing teams needing advanced features', 'package', 25000, 20000, null, 'IDR', '[]', true, NOW(), NOW()),
            (3, 'Pro', 'For enterprises needing full control and customization', 'package', 75000, 70000, null, 'IDR', '[]', true, NOW(), NOW()),
            (4, 'Standard Seat', 'Basic access for individual team members', 'seat', null, null, 5000, 'IDR', '[]', true, NOW(), NOW()),
            (5, 'Premium Seat', 'Enhanced access with advanced features', 'seat', null, null, 10000, 'IDR', '[]', true, NOW(), NOW()),
            (6, 'Enterprise Seat', 'Full feature access for power users', 'seat', null, null, 15000, 'IDR', '[]', true, NOW(), NOW())
        ");
    } else {
        // Use basic columns format
        DB::statement("
            INSERT INTO plans (id, name, description, type, currency, features, is_active, created_at, updated_at) VALUES
            (1, 'Starter', 'Perfect for small teams getting started with HRIS', 'package', 'IDR', '[]', true, NOW(), NOW()),
            (2, 'Lite', 'Ideal for growing teams needing advanced features', 'package', 'IDR', '[]', true, NOW(), NOW()),
            (3, 'Pro', 'For enterprises needing full control and customization', 'package', 'IDR', '[]', true, NOW(), NOW()),
            (4, 'Standard Seat', 'Basic access for individual team members', 'seat', 'IDR', '[]', true, NOW(), NOW()),
            (5, 'Premium Seat', 'Enhanced access with advanced features', 'seat', 'IDR', '[]', true, NOW(), NOW()),
            (6, 'Enterprise Seat', 'Full feature access for power users', 'seat', 'IDR', '[]', true, NOW(), NOW())
        ");
    }
    
    echo "✅ Plans seeded successfully!\n\n";
    
    // Now seed payment methods
    echo "🌱 Seeding payment methods (using actual column names)...\n";
    
    // Clear existing data first
    DB::table('payment_methods')->truncate();
    
    // Check column names for payment methods
    $hasCode = collect($paymentColumns)->contains(fn($col) => $col->column_name === 'code');
    $hasName = collect($paymentColumns)->contains(fn($col) => $col->column_name === 'name');
    $hasType = collect($paymentColumns)->contains(fn($col) => $col->column_name === 'type');
    $hasProcessingFee = collect($paymentColumns)->contains(fn($col) => $col->column_name === 'processing_fee');
    $hasIsActive = collect($paymentColumns)->contains(fn($col) => $col->column_name === 'is_active');
    
    echo "Payment columns: code=$hasCode, name=$hasName, type=$hasType, processing_fee=$hasProcessingFee, is_active=$hasIsActive\n";
    
    if ($hasCode && $hasName && $hasType) {
        // Use the proper column names
        $sql = "INSERT INTO payment_methods (id, ";
        $values = "VALUES ";
        
        $columns = ['id'];
        if ($hasCode) $columns[] = 'code';
        if ($hasName) $columns[] = 'name';  
        if ($hasType) $columns[] = 'type';
        if ($hasProcessingFee) $columns[] = 'processing_fee';
        if ($hasIsActive) $columns[] = 'is_active';
        $columns[] = 'created_at';
        $columns[] = 'updated_at';
        
        $sql .= implode(', ', array_slice($columns, 1)) . ") ";
        
        $paymentData = [
            [1, 'visa', 'Visa', 'card', 2500, true],
            [2, 'mastercard', 'Mastercard', 'card', 2500, true],
            [3, 'bca', 'Bank Central Asia (BCA)', 'bank', 2500, true],
            [4, 'mandiri', 'Bank Mandiri', 'bank', 2500, true],
            [5, 'bni', 'Bank Negara Indonesia (BNI)', 'bank', 2500, true],
            [6, 'gopay', 'GoPay', 'digital_wallet', 1000, true],
            [7, 'dana', 'DANA', 'digital_wallet', 1000, true],
            [8, 'ovo', 'OVO', 'digital_wallet', 1000, true]
        ];
        
        $valueStrings = [];
        foreach ($paymentData as $data) {
            $valueStr = "(";
            $valueStr .= $data[0] . ", "; // id
            if ($hasCode) $valueStr .= "'" . $data[1] . "', ";
            if ($hasName) $valueStr .= "'" . $data[2] . "', ";
            if ($hasType) $valueStr .= "'" . $data[3] . "', ";
            if ($hasProcessingFee) $valueStr .= $data[4] . ", ";
            if ($hasIsActive) $valueStr .= ($data[5] ? 'true' : 'false') . ", ";
            $valueStr .= "NOW(), NOW())";
            $valueStrings[] = $valueStr;
        }
        
        $sql .= $values . implode(', ', $valueStrings);
        DB::statement($sql);
    } else {
        // Fallback: just insert basic data
        DB::statement("
            INSERT INTO payment_methods (id, created_at, updated_at) VALUES
            (1, NOW(), NOW()),
            (2, NOW(), NOW()),
            (3, NOW(), NOW()),
            (4, NOW(), NOW()),
            (5, NOW(), NOW()),
            (6, NOW(), NOW()),
            (7, NOW(), NOW()),
            (8, NOW(), NOW())
        ");
    }
    
    echo "✅ Payment methods seeded successfully!\n\n";
    
    // Verify the data
    echo "📊 Verification:\n";
    $planCount = DB::table('plans')->count();
    $paymentCount = DB::table('payment_methods')->count();
    
    echo "Plans: $planCount records\n";
    echo "Payment methods: $paymentCount records\n";
    
    if ($planCount > 0 && $paymentCount > 0) {
        echo "\n🎉 Plans feature database setup completed successfully!\n";
    } else {
        echo "\n⚠️ Some tables have no data. Check for errors above.\n";
    }
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "Stack trace:\n" . $e->getTraceAsString() . "\n";
}
