<?php

require_once __DIR__ . '/vendor/autoload.php';

// Bootstrap Laravel
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Plan;

echo "Testing Plan Pricing:\n";
echo "====================\n";

$plans = Plan::all();
foreach ($plans as $plan) {
    echo "Plan: {$plan->name}\n";
    echo "  Type: {$plan->type}\n";
    if ($plan->isPackagePlan()) {
        echo "  Monthly: {$plan->currency} " . number_format($plan->monthly_price) . "\n";
        echo "  Yearly: {$plan->currency} " . number_format($plan->yearly_price) . "\n";
    } else {
        echo "  Per Seat: {$plan->currency} " . number_format($plan->seat_price) . "\n";
    }
    echo "\n";
}

echo "✅ Pricing test completed!\n";
