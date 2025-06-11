<?php
/**
 * Fixed Enhanced Plans Seeder - Works with existing table structure
 */

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class FixedEnhancedPlansSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $now = Carbon::now();

        // First, clear existing data
        DB::table('plans')->delete();
        DB::table('payment_methods')->delete();

        // Insert Plans (matching your existing table structure)
        $plans = [
            [
                'id' => 1,
                'name' => 'Starter',
                'description' => 'Perfect for small teams getting started with HRIS',
                'type' => 'package',
                'monthly_price' => 0,
                'yearly_price' => 0,
                'currency' => 'IDR',
                'features' => json_encode([
                    ['name' => 'GPS-based attendance validation', 'included' => true],
                    ['name' => 'Employee data management', 'included' => true, 'limit' => 'Up to 10 employees'],
                    ['name' => 'Leave and time-off requests', 'included' => true],
                    ['name' => 'Overtime management', 'included' => true],
                    ['name' => 'Basic reporting', 'included' => true],
                    ['name' => 'Email support', 'included' => true],
                ]),
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'id' => 2,
                'name' => 'Lite',
                'description' => 'Ideal for growing teams needing advanced features',
                'type' => 'package',
                'monthly_price' => 25000,
                'yearly_price' => 20000,
                'currency' => 'IDR',
                'features' => json_encode([
                    ['name' => 'All Starter features', 'included' => true],
                    ['name' => 'Employee data management', 'included' => true, 'limit' => 'Up to 50 employees'],
                    ['name' => 'Clock-in/out attendance settings', 'included' => true],
                    ['name' => 'Employee document management', 'included' => true],
                    ['name' => 'Shift management', 'included' => true],
                    ['name' => 'Advanced reporting', 'included' => true],
                    ['name' => 'Mobile app access', 'included' => true],
                ]),
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'id' => 3,
                'name' => 'Pro',
                'description' => 'For enterprises needing full control and customization',
                'type' => 'package',
                'monthly_price' => 75000,
                'yearly_price' => 70000,
                'currency' => 'IDR',
                'features' => json_encode([
                    ['name' => 'All Lite features', 'included' => true],
                    ['name' => 'Employee data management', 'included' => true, 'limit' => 'Unlimited employees'],
                    ['name' => 'API access', 'included' => true],
                    ['name' => 'Custom integrations', 'included' => true],
                    ['name' => 'White labeling', 'included' => true],
                    ['name' => 'Dedicated account manager', 'included' => true],
                    ['name' => '24/7 phone support', 'included' => true],
                    ['name' => 'Advanced analytics', 'included' => true],
                ]),
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'id' => 4,
                'name' => 'Standard Seat',
                'description' => 'Basic access for individual team members',
                'type' => 'seat',
                'seat_price' => 5000,
                'currency' => 'IDR',
                'features' => json_encode([
                    ['name' => 'Basic time tracking', 'included' => true],
                    ['name' => 'Personal dashboard', 'included' => true],
                    ['name' => 'Leave requests', 'included' => true],
                    ['name' => 'Email support', 'included' => true],
                    ['name' => 'Mobile app access', 'included' => true],
                ]),
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'id' => 5,
                'name' => 'Premium Seat',
                'description' => 'Enhanced access with advanced features',
                'type' => 'seat',
                'seat_price' => 10000,
                'currency' => 'IDR',
                'features' => json_encode([
                    ['name' => 'All Standard features', 'included' => true],
                    ['name' => 'Advanced reporting', 'included' => true],
                    ['name' => 'Project management', 'included' => true],
                    ['name' => 'Priority email support', 'included' => true],
                    ['name' => 'Advanced analytics', 'included' => true],
                ]),
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'id' => 6,
                'name' => 'Enterprise Seat',
                'description' => 'Full feature access for power users',
                'type' => 'seat',
                'seat_price' => 15000,
                'currency' => 'IDR',
                'features' => json_encode([
                    ['name' => 'All Premium features', 'included' => true],
                    ['name' => 'Full feature access', 'included' => true],
                    ['name' => 'Dedicated support', 'included' => true],
                    ['name' => 'Custom integrations', 'included' => true],
                    ['name' => 'API access', 'included' => true],
                    ['name' => 'White labeling', 'included' => true],
                    ['name' => 'Advanced security', 'included' => true],
                    ['name' => '24/7 phone support', 'included' => true],
                ]),
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ];

        DB::table('plans')->insert($plans);

        // Insert Payment Methods (matching your existing table structure)
        $paymentMethods = [
            [
                'id' => 1,
                'name' => 'Visa',
                'type' => 'card',
                'processing_fee' => 2500,
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'id' => 2,
                'name' => 'Mastercard',
                'type' => 'card',
                'processing_fee' => 2500,
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'id' => 3,
                'name' => 'Bank Central Asia (BCA)',
                'type' => 'bank',
                'processing_fee' => 2500,
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'id' => 4,
                'name' => 'Bank Mandiri',
                'type' => 'bank',
                'processing_fee' => 2500,
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'id' => 5,
                'name' => 'Bank Negara Indonesia (BNI)',
                'type' => 'bank',
                'processing_fee' => 2500,
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'id' => 6,
                'name' => 'GoPay',
                'type' => 'digital_wallet',
                'processing_fee' => 1000,
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'id' => 7,
                'name' => 'DANA',
                'type' => 'digital_wallet',
                'processing_fee' => 1000,
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'id' => 8,
                'name' => 'OVO',
                'type' => 'digital_wallet',
                'processing_fee' => 1000,
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ];

        DB::table('payment_methods')->insert($paymentMethods);

        echo "✅ Fixed Enhanced Plans Seeder completed successfully!\n";
        echo "📊 Inserted " . count($plans) . " plans and " . count($paymentMethods) . " payment methods\n";
    }
}
