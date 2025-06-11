<?php
/**
 * Test Plans API functionality
 */

require_once __DIR__ . '/vendor/autoload.php';

// Bootstrap Laravel
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\Plan;
use App\Models\PaymentMethod;

echo "=== Testing Plans API ===\n";

try {
    echo "1. Testing Plan model...\n";
    $plans = Plan::all();
    echo "   ✅ Found {$plans->count()} plans\n";
    
    if ($plans->count() > 0) {
        $firstPlan = $plans->first();
        echo "   Sample plan: {$firstPlan->name} ({$firstPlan->type})\n";
    }
    
    echo "\n2. Testing PaymentMethod model...\n";
    $paymentMethods = PaymentMethod::all();
    echo "   ✅ Found {$paymentMethods->count()} payment methods\n";
    
    if ($paymentMethods->count() > 0) {
        $firstPayment = $paymentMethods->first();
        echo "   Sample payment: {$firstPayment->name} ({$firstPayment->type})\n";
    }
    
    echo "\n3. Testing API endpoints...\n";
    
    // Test plans endpoint
    echo "   Testing /api/plans...\n";
    $request = Request::create('/api/plans', 'GET');
    $app->instance('request', $request);
    
    $controller = new App\Http\Controllers\Api\PlanController();
    $response = $controller->index();
    $data = json_decode($response->getContent(), true);
    
    if ($data['success'] ?? false) {
        echo "   ✅ Plans API working - found " . count($data['data']) . " plans\n";
    } else {
        echo "   ❌ Plans API failed\n";
    }
    
    // Test payment methods endpoint
    echo "   Testing /api/payment-methods...\n";
    $controller = new App\Http\Controllers\Api\PaymentController();
    $response = $controller->index();
    $data = json_decode($response->getContent(), true);
    
    if ($data['success'] ?? false) {
        $totalMethods = count($data['data']['cards'] ?? []) + 
                       count($data['data']['banks'] ?? []) + 
                       count($data['data']['digital_wallets'] ?? []);
        echo "   ✅ Payment methods API working - found {$totalMethods} methods\n";
    } else {
        echo "   ❌ Payment methods API failed\n";
    }
    
    echo "\n🎉 Plans feature API testing completed!\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}
