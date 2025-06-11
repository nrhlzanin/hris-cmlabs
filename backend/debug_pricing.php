<?php
require_once __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "🔍 DEBUGGING PRICING ISSUE\n";
echo "==========================\n\n";

// Check all plans
$plans = App\Models\Plan::all();
echo "📋 All Plans in Database:\n";
foreach ($plans as $plan) {
    echo "   - {$plan->name} (Type: {$plan->type})\n";
    echo "     Monthly: {$plan->currency} " . number_format($plan->monthly_price ?? 0) . "\n";
    echo "     Yearly: {$plan->currency} " . number_format($plan->yearly_price ?? 0) . "\n";
    echo "     Seat Price: {$plan->currency} " . number_format($plan->seat_price ?? 0) . "\n";
    echo "     getPrice('monthly'): {$plan->currency} " . number_format($plan->getPrice('monthly')) . "\n";
    echo "     getPrice('yearly'): {$plan->currency} " . number_format($plan->getPrice('yearly')) . "\n";
    echo "\n";
}

// Test the calculate API
echo "🧮 Testing Calculate API:\n";
try {
    // Find Lite plan
    $litePlan = App\Models\Plan::where('name', 'Lite')->first();
    if ($litePlan) {
        echo "   Testing Lite plan (ID: {$litePlan->id}):\n";
        
        // Simulate API calculation
        $unitPrice = $litePlan->getPrice('monthly');
        $quantity = 1;
        $subtotal = $unitPrice * $quantity;
        $taxAmount = round($subtotal * 0.11);
        $totalAmount = $subtotal + $taxAmount;
        
        echo "   - Unit Price: {$litePlan->currency} " . number_format($unitPrice) . "\n";
        echo "   - Quantity: {$quantity}\n";
        echo "   - Subtotal: {$litePlan->currency} " . number_format($subtotal) . "\n";
        echo "   - Tax (11%): {$litePlan->currency} " . number_format($taxAmount) . "\n";
        echo "   - Total: {$litePlan->currency} " . number_format($totalAmount) . "\n";
    } else {
        echo "   ❌ Lite plan not found!\n";
    }
} catch (Exception $e) {
    echo "   ❌ Error: " . $e->getMessage() . "\n";
}
