<?php
/**
 * Test Plans API functionality only
 */

require_once __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\DB;

echo "=== Testing Plans Feature ===\n";

try {
    // Test database connection
    echo "🔗 Testing connection...\n";
    DB::connection()->getPdo();
    echo "✅ Connected!\n\n";
    
    // Check plans table
    echo "📋 Checking plans...\n";
    $plans = DB::table('plans')->get();
    foreach ($plans as $plan) {
        echo "  - {$plan->name} ({$plan->type})\n";
    }
    echo "Total plans: " . count($plans) . "\n\n";
    
    // Check payment methods
    echo "💳 Checking payment methods...\n";
    $payments = DB::table('payment_methods')->get();
    foreach ($payments as $payment) {
        echo "  - {$payment->name} ({$payment->type})\n";
    }
    echo "Total payment methods: " . count($payments) . "\n\n";
    
    // Test API endpoints
    echo "🌐 Testing API endpoints...\n";
    
    // Test plans endpoint
    $response = file_get_contents('http://127.0.0.1:8000/api/plans');
    if ($response) {
        $data = json_decode($response, true);
        echo "✅ /api/plans - Returns " . count($data['data']) . " plans\n";
    } else {
        echo "❌ /api/plans - Failed\n";
    }
    
    // Test payment methods endpoint
    $response = file_get_contents('http://127.0.0.1:8000/api/payment-methods');
    if ($response) {
        $data = json_decode($response, true);
        echo "✅ /api/payment-methods - Working\n";
    } else {
        echo "❌ /api/payment-methods - Failed\n";
    }
    
    echo "\n🎉 Plans feature test complete!\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}
