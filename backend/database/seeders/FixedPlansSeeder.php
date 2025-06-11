<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class FixedPlansSeeder extends Seeder
{
    /**
     * Run the database seeds for basic plans feature.
     * Uses basic tables: plans, payment_methods, subscriptions, orders
     */
    public function run(): void
    {
        $now = Carbon::now();

        // Clear existing data
        DB::table('plans')->truncate();
        DB::table('payment_methods')->truncate();

        echo "🌱 Seeding basic plans data...\n";

        // Basic Plans Data (matches your frontend config)
        $plans = [
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
                'seat_price' => null,
                'currency' => 'IDR',
                'features' => json_encode([
                    ['name' => 'All Starter features', 'included' => true],
                    ['name' => 'Employee data management', 'included' => true, 'limit' => 'Up to 50 employees'],
                    ['name' => 'Clock-in/out attendance settings', 'included' => true],
                    ['name' => 'Employee document management', 'included' => true],
                    ['name' => 'Sick leave & time-out settings', 'included' => true],
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
                'seat_price' => null,
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
                    ['name' => 'SSO integration', 'included' => true],
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
                'monthly_price' => null,
                'yearly_price' => null,
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
                'monthly_price' => null,
                'yearly_price' => null,
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
                'monthly_price' => null,
                'yearly_price' => null,
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

        // Insert plans
        DB::table('plans')->insert($plans);
        echo "✅ Inserted " . count($plans) . " plans\n";

        // Basic Payment Methods Data
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

        // Insert payment methods
        DB::table('payment_methods')->insert($paymentMethods);
        echo "✅ Inserted " . count($paymentMethods) . " payment methods\n";

        echo "🎉 Basic plans seeding completed successfully!\n";
    }
}
