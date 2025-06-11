<?php

// Bootstrap Laravel application properly
require_once __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';

// Boot the application
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

// Test our models directly
echo "Testing Plans model...\n";
try {
    $plans = App\Models\Plan::all();
    echo "Plans found: " . $plans->count() . "\n";
    foreach ($plans as $plan) {
        echo "- {$plan->name} ({$plan->type}): {$plan->currency} {$plan->price_monthly}\n";
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}

echo "\nTesting PaymentMethods model...\n";
try {
    $paymentMethods = App\Models\PaymentMethod::all();
    echo "Payment methods found: " . $paymentMethods->count() . "\n";
    foreach ($paymentMethods->take(5) as $method) {
        echo "- {$method->name} ({$method->type})\n";
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}

echo "\nTesting Carbon dates...\n";
try {
    $now = now();
    $yearLater = clone $now;
    $yearLater->addYear();
    echo "Now: " . $now->toDateString() . "\n";
    echo "Year later: " . $yearLater->toDateString() . "\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}

echo "\nDone!\n";
