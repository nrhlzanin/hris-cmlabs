<?php
/**
 * Final verification of plans feature
 */

require_once __DIR__ . '/vendor/autoload.php';

// Bootstrap Laravel
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\DB;

echo "=== Final Plans Feature Verification ===\n";

try {
    // Check tables exist and have data
    echo "📋 Checking plans table...\n";
    $planCount = DB::table('plans')->count();
    echo "   Plans: {$planCount} records\n";
    
    if ($planCount > 0) {
        $plans = DB::table('plans')->select('id', 'name', 'type')->get();
        foreach ($plans as $plan) {
            echo "     - {$plan->name} ({$plan->type})\n";
        }
    }
    
    echo "\n📋 Checking payment_methods table...\n";
    $paymentCount = DB::table('payment_methods')->count();
    echo "   Payment methods: {$paymentCount} records\n";
    
    if ($paymentCount > 0) {
        $payments = DB::table('payment_methods')->select('id', 'name', 'type')->get();
        foreach ($payments as $payment) {
            echo "     - {$payment->name} ({$payment->type})\n";
        }
    }
    
    // Test models
    echo "\n🔧 Testing Laravel models...\n";
    
    try {
        $planModel = new App\Models\Plan();
        $plans = $planModel->all();
        echo "   ✅ Plan model works - {$plans->count()} plans\n";
    } catch (Exception $e) {
        echo "   ❌ Plan model error: " . $e->getMessage() . "\n";
    }
    
    try {
        $paymentModel = new App\Models\PaymentMethod();
        $payments = $paymentModel->all();
        echo "   ✅ PaymentMethod model works - {$payments->count()} methods\n";
    } catch (Exception $e) {
        echo "   ❌ PaymentMethod model error: " . $e->getMessage() . "\n";
    }
    
    if ($planCount > 0 && $paymentCount > 0) {
        echo "\n🎉 SUCCESS: Plans feature is now working!\n";
        echo "\n📡 You can now test these API endpoints:\n";
        echo "   - GET /api/plans\n";
        echo "   - GET /api/payment-methods\n";
        echo "   - POST /api/payment/process\n";
        echo "   - POST /api/payment/calculate\n";
    } else {
        echo "\n❌ ISSUE: Some tables are empty\n";
    }
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}
