<?php
/**
 * Test API endpoints without authentication
 */

require_once __DIR__ . '/vendor/autoload.php';

echo "=== Testing Public API Endpoints ===\n";

// Test plans endpoint
echo "Testing GET /api/plans...\n";
$plansResponse = file_get_contents('http://127.0.0.1:8000/api/plans');
if ($plansResponse !== false) {
    $plansData = json_decode($plansResponse, true);
    if (isset($plansData['success']) && $plansData['success']) {
        echo "✅ Plans API works - found " . count($plansData['data']) . " plans\n";
    } else {
        echo "❌ Plans API failed: " . $plansResponse . "\n";
    }
} else {
    echo "❌ Could not connect to plans API\n";
}

// Test payment methods endpoint
echo "\nTesting GET /api/payment-methods...\n";
$paymentResponse = file_get_contents('http://127.0.0.1:8000/api/payment-methods');
if ($paymentResponse !== false) {
    $paymentData = json_decode($paymentResponse, true);
    if (isset($paymentData['success']) && $paymentData['success']) {
        $totalMethods = count($paymentData['data']['cards'] ?? []) + 
                       count($paymentData['data']['banks'] ?? []) + 
                       count($paymentData['data']['digital_wallets'] ?? []);
        echo "✅ Payment methods API works - found {$totalMethods} methods\n";
    } else {
        echo "❌ Payment methods API failed: " . $paymentResponse . "\n";
    }
} else {
    echo "❌ Could not connect to payment methods API\n";
}

echo "\n🎉 API testing completed!\n";
