<?php

echo "=== HRIS Backend API Test ===\n\n";

// Test 1: Check if Laravel can bootstrap
echo "1. Testing Laravel Bootstrap...\n";
try {
    require_once __DIR__.'/vendor/autoload.php';
    $app = require_once __DIR__.'/bootstrap/app.php';
    
    echo "✓ Laravel bootstrap successful\n";
} catch (Exception $e) {
    echo "✗ Laravel bootstrap failed: " . $e->getMessage() . "\n";
    exit(1);
}

// Test 2: Check environment
echo "\n2. Testing Environment...\n";
try {
    $app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
    echo "✓ Environment loaded\n";
    echo "  - App Name: " . config('app.name') . "\n";
    echo "  - App Env: " . config('app.env') . "\n";
    echo "  - Database: " . config('database.default') . "\n";
} catch (Exception $e) {
    echo "✗ Environment failed: " . $e->getMessage() . "\n";
}

// Test 3: Check database connection
echo "\n3. Testing Database Connection...\n";
try {
    $pdo = DB::connection()->getPdo();
    echo "✓ Database connection successful\n";
    echo "  - Driver: " . $pdo->getAttribute(PDO::ATTR_DRIVER_NAME) . "\n";
} catch (Exception $e) {
    echo "✗ Database connection failed: " . $e->getMessage() . "\n";
}

// Test 4: Check if tables exist
echo "\n4. Testing Database Tables...\n";
try {
    $tables = ['plans', 'payment_methods', 'users'];
    foreach ($tables as $table) {
        $exists = Schema::hasTable($table);
        echo ($exists ? "✓" : "✗") . " Table '{$table}': " . ($exists ? "exists" : "missing") . "\n";
    }
} catch (Exception $e) {
    echo "✗ Table check failed: " . $e->getMessage() . "\n";
}

// Test 5: Test models (with timeout protection)
echo "\n5. Testing Models...\n";
try {
    // Set a timeout for model operations
    set_time_limit(10);
    
    $planCount = App\Models\Plan::count();
    echo "✓ Plans model: {$planCount} records\n";
    
    $paymentCount = App\Models\PaymentMethod::count();
    echo "✓ PaymentMethods model: {$paymentCount} records\n";
    
} catch (Exception $e) {
    echo "✗ Model test failed: " . $e->getMessage() . "\n";
}

echo "\n=== Test Complete ===\n";
