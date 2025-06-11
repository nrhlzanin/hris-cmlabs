<?php
/**
 * Fixed seeding script with correct column names
 */

require_once __DIR__ . '/vendor/autoload.php';

// Bootstrap Laravel
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\DB;

echo "🌱 Seeding database with correct column names...\n\n";

try {
    // Clear existing data
    DB::table('plans')->truncate();
    DB::table('payment_methods')->truncate();
    
    echo "📋 Seeding plans...\n";
    
    // Insert plans with correct column names
    DB::table('plans')->insert([
        [
            'id' => 1,
            'name' => 'Starter',
            'description' => 'Perfect for small teams getting started with HRIS',
            'type' => 'package',
            'monthly_price' => 0,
            'yearly_price' => 0,
            'seat_price' => null,
            'currency' => 'IDR',
            'features' => json_encode([
                ['name' => 'GPS-based attendance validation', 'included' => true],
                ['name' => 'Employee data management', 'included' => true, 'limit' => 'Up to 10 employees'],
                ['name' => 'Basic reporting', 'included' => true],
                ['name' => 'Email support', 'included' => true],
            ]),
            'is_recommended' => false,
            'is_popular' => false,
            'button_text' => 'Current Plan',
            'button_variant' => 'outline',
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ],
        [
            'id' => 2,
            'name' => 'Lite',
            'description' => 'Ideal for growing teams needing advanced features',
            'type' => 'package',
            'monthly_price' => 25000,
            'yearly_price' => 20000,
            'seat_price' => null,
            'currency' => 'IDR',
            'features' => json_encode([
                ['name' => 'All Starter features', 'included' => true],
                ['name' => 'Employee data management', 'included' => true, 'limit' => 'Up to 50 employees'],
                ['name' => 'Advanced reporting', 'included' => true],
                ['name' => 'Mobile app access', 'included' => true],
            ]),
            'is_recommended' => true,
            'is_popular' => false,
            'button_text' => 'Upgrade Plan',
            'button_variant' => 'primary',
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ],
        [
            'id' => 3,
            'name' => 'Pro',
            'description' => 'For enterprises needing full control and customization',
            'type' => 'package',
            'monthly_price' => 75000,
            'yearly_price' => 70000,
            'seat_price' => null,
            'currency' => 'IDR',
            'features' => json_encode([
                ['name' => 'All Lite features', 'included' => true],
                ['name' => 'Unlimited employees', 'included' => true],
                ['name' => 'API access', 'included' => true],
                ['name' => 'Custom integrations', 'included' => true],
                ['name' => '24/7 phone support', 'included' => true],
            ]),
            'is_recommended' => false,
            'is_popular' => true,
            'button_text' => 'Upgrade Plan',
            'button_variant' => 'primary',
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ],
        [
            'id' => 4,
            'name' => 'Standard Seat',
            'description' => 'Basic access for individual team members',
            'type' => 'seat',
            'monthly_price' => null,
            'yearly_price' => null,
            'seat_price' => 5000,
            'currency' => 'IDR',
            'features' => json_encode([
                ['name' => 'Basic time tracking', 'included' => true],
                ['name' => 'Personal dashboard', 'included' => true],
                ['name' => 'Leave requests', 'included' => true],
                ['name' => 'Email support', 'included' => true],
            ]),
            'is_recommended' => false,
            'is_popular' => false,
            'button_text' => 'Select Seats',
            'button_variant' => 'primary',
            'min_seats' => 1,
            'max_seats' => 100,
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ],
        [
            'id' => 5,
            'name' => 'Premium Seat',
            'description' => 'Enhanced access with advanced features',
            'type' => 'seat',
            'monthly_price' => null,
            'yearly_price' => null,
            'seat_price' => 10000,
            'currency' => 'IDR',
            'features' => json_encode([
                ['name' => 'All Standard features', 'included' => true],
                ['name' => 'Advanced reporting', 'included' => true],
                ['name' => 'Project management', 'included' => true],
                ['name' => 'Priority support', 'included' => true],
            ]),
            'is_recommended' => false,
            'is_popular' => false,
            'button_text' => 'Select Seats',
            'button_variant' => 'primary',
            'min_seats' => 1,
            'max_seats' => 100,
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ],
        [
            'id' => 6,
            'name' => 'Enterprise Seat',
            'description' => 'Full feature access for power users',
            'type' => 'seat',
            'monthly_price' => null,
            'yearly_price' => null,
            'seat_price' => 15000,
            'currency' => 'IDR',
            'features' => json_encode([
                ['name' => 'All Premium features', 'included' => true],
                ['name' => 'Full feature access', 'included' => true],
                ['name' => 'API access', 'included' => true],
                ['name' => 'White labeling', 'included' => true],
                ['name' => 'Dedicated support', 'included' => true],
            ]),
            'is_recommended' => false,
            'is_popular' => false,
            'button_text' => 'Select Seats',
            'button_variant' => 'primary',
            'min_seats' => 1,
            'max_seats' => null,
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ],
    ]);
    
    echo "✅ Plans seeded successfully!\n\n";
    
    echo "💳 Seeding payment methods...\n";
    
    // Insert payment methods
    DB::table('payment_methods')->insert([
        [
            'id' => 1,
            'code' => 'visa',
            'name' => 'Visa',
            'type' => 'card',
            'logo_url' => '/img/payment/visa.svg',
            'processing_fee' => 0,
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ],
        [
            'id' => 2,
            'code' => 'mastercard',
            'name' => 'Mastercard',
            'type' => 'card',
            'logo_url' => '/img/payment/mastercard.svg',
            'processing_fee' => 0,
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ],
        [
            'id' => 3,
            'code' => 'bca',
            'name' => 'Bank Central Asia (BCA)',
            'type' => 'bank',
            'logo_url' => '/img/payment/bca.svg',
            'processing_fee' => 2500,
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ],
        [
            'id' => 4,
            'code' => 'mandiri',
            'name' => 'Bank Mandiri',
            'type' => 'bank',
            'logo_url' => '/img/payment/mandiri.svg',
            'processing_fee' => 2500,
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ],
        [
            'id' => 5,
            'code' => 'bni',
            'name' => 'Bank Negara Indonesia (BNI)',
            'type' => 'bank',
            'logo_url' => '/img/payment/bni.svg',
            'processing_fee' => 2500,
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ],
        [
            'id' => 6,
            'code' => 'gopay',
            'name' => 'GoPay',
            'type' => 'digital_wallet',
            'logo_url' => '/img/payment/gopay.svg',
            'processing_fee' => 1000,
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ],
        [
            'id' => 7,
            'code' => 'dana',
            'name' => 'DANA',
            'type' => 'digital_wallet',
            'logo_url' => '/img/payment/dana.svg',
            'processing_fee' => 1000,
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ],
        [
            'id' => 8,
            'code' => 'ovo',
            'name' => 'OVO',
            'type' => 'digital_wallet',
            'logo_url' => '/img/payment/ovo.svg',
            'processing_fee' => 1000,
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ],
    ]);
    
    echo "✅ Payment methods seeded successfully!\n\n";
    
    // Verify the data
    $planCount = DB::table('plans')->count();
    $paymentCount = DB::table('payment_methods')->count();
    
    echo "📊 Verification:\n";
    echo "  - Plans: {$planCount} records\n";
    echo "  - Payment Methods: {$paymentCount} records\n\n";
    
    echo "🎉 Database seeding completed successfully!\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "Stack trace: " . $e->getTraceAsString() . "\n";
}
