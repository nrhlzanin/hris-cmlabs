<?php
/**
 * Direct SQL Table Creator for HRIS Plans
 */

require_once __DIR__ . '/vendor/autoload.php';

// Bootstrap Laravel
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\DB;

echo "🔧 Creating HRIS Plans Tables Directly\n";
echo "=====================================\n\n";

try {
    DB::connection()->getPdo();
    echo "✅ Connected to Supabase\n\n";
    
    // Create plans table
    echo "📋 Creating plans table...\n";
    DB::statement("
        CREATE TABLE IF NOT EXISTS plans (
            id BIGSERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            description TEXT NOT NULL,
            type VARCHAR(50) CHECK (type IN ('package', 'seat')) NOT NULL,
            price_monthly DECIMAL(10,2),
            price_yearly DECIMAL(10,2),
            price_per_seat DECIMAL(10,2),
            currency VARCHAR(3) DEFAULT 'IDR',
            features JSONB,
            is_active BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
        )
    ");
    echo "✅ Plans table created\n";
    
    // Create payment_methods table
    echo "📋 Creating payment_methods table...\n";
    DB::statement("
        CREATE TABLE IF NOT EXISTS payment_methods (
            id BIGSERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            type VARCHAR(50) NOT NULL,
            code VARCHAR(255) UNIQUE NOT NULL,
            processing_fee DECIMAL(8,2) DEFAULT 0,
            is_active BOOLEAN DEFAULT TRUE,
            logo_url VARCHAR(500),
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
        )
    ");
    echo "✅ Payment methods table created\n";
    
    // Create subscriptions table
    echo "📋 Creating subscriptions table...\n";
    DB::statement("
        CREATE TABLE IF NOT EXISTS subscriptions (
            id BIGSERIAL PRIMARY KEY,
            user_id BIGINT NOT NULL,
            plan_id BIGINT NOT NULL REFERENCES plans(id) ON DELETE CASCADE,
            billing_period VARCHAR(50),
            quantity INTEGER DEFAULT 1,
            unit_price DECIMAL(10,2) NOT NULL,
            total_price DECIMAL(10,2) NOT NULL,
            currency VARCHAR(3) DEFAULT 'IDR',
            status VARCHAR(50) DEFAULT 'active',
            starts_at TIMESTAMPTZ NOT NULL,
            ends_at TIMESTAMPTZ NOT NULL,
            cancelled_at TIMESTAMPTZ,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
        )
    ");
    echo "✅ Subscriptions table created\n";
    
    // Create orders table
    echo "📋 Creating orders table...\n";
    DB::statement("
        CREATE TABLE IF NOT EXISTS orders (
            id BIGSERIAL PRIMARY KEY,
            order_id VARCHAR(255) UNIQUE NOT NULL,
            user_id BIGINT NOT NULL,
            plan_id BIGINT NOT NULL REFERENCES plans(id) ON DELETE CASCADE,
            payment_method_id BIGINT NOT NULL REFERENCES payment_methods(id) ON DELETE CASCADE,
            billing_period VARCHAR(50),
            quantity INTEGER DEFAULT 1,
            unit_price DECIMAL(10,2) NOT NULL,
            subtotal DECIMAL(10,2) NOT NULL,
            tax_amount DECIMAL(10,2) DEFAULT 0,
            processing_fee DECIMAL(10,2) DEFAULT 0,
            total_amount DECIMAL(10,2) NOT NULL,
            currency VARCHAR(3) DEFAULT 'IDR',
            billing_info JSONB NOT NULL,
            status VARCHAR(50) DEFAULT 'pending',
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
        )
    ");
    echo "✅ Orders table created\n";
    
    echo "\n🌱 Inserting seed data...\n";
    
    // Insert plans
    DB::statement("
        INSERT INTO plans (id, name, description, type, price_monthly, price_yearly, currency, features, is_active) VALUES
        (1, 'Starter', 'Perfect for small teams getting started with HRIS', 'package', 0, 0, 'IDR', '[]', true),
        (2, 'Lite', 'Ideal for growing teams needing advanced features', 'package', 25000, 20000, 'IDR', '[]', true),
        (3, 'Pro', 'For enterprises needing full control and customization', 'package', 75000, 70000, 'IDR', '[]', true),
        (4, 'Standard Seat', 'Basic access for individual team members', 'seat', null, null, 'IDR', '[]', true),
        (5, 'Premium Seat', 'Enhanced access with advanced features', 'seat', null, null, 'IDR', '[]', true),
        (6, 'Enterprise Seat', 'Full feature access for power users', 'seat', null, null, 'IDR', '[]', true)
        ON CONFLICT (id) DO NOTHING
    ");
    
    // Update seat prices
    DB::statement("
        UPDATE plans SET price_per_seat = CASE 
            WHEN name = 'Standard Seat' THEN 5000
            WHEN name = 'Premium Seat' THEN 10000
            WHEN name = 'Enterprise Seat' THEN 15000
            ELSE price_per_seat
        END
        WHERE type = 'seat'
    ");
    
    echo "✅ Plans seeded\n";
    
    // Insert payment methods
    DB::statement("
        INSERT INTO payment_methods (id, name, type, code, processing_fee, is_active) VALUES
        (1, 'Visa', 'card', 'visa', 0, true),
        (2, 'Mastercard', 'card', 'mastercard', 0, true),
        (3, 'Bank Central Asia (BCA)', 'bank', 'bca', 2500, true),
        (4, 'Bank Mandiri', 'bank', 'mandiri', 2500, true),
        (5, 'Bank Negara Indonesia (BNI)', 'bank', 'bni', 2500, true),
        (6, 'GoPay', 'digital_wallet', 'gopay', 1000, true),
        (7, 'DANA', 'digital_wallet', 'dana', 1000, true),
        (8, 'OVO', 'digital_wallet', 'ovo', 1000, true)
        ON CONFLICT (id) DO NOTHING
    ");
    
    echo "✅ Payment methods seeded\n";
    
    // Update migration records
    echo "\n📋 Updating migration records...\n";
    $migrations = [
        '2025_06_11_113355_create_plans_table',
        '2025_06_11_113413_create_payment_methods_table', 
        '2025_06_11_113424_create_subscriptions_table',
        '2025_06_11_113432_create_orders_table'
    ];
    
    foreach ($migrations as $migration) {
        DB::statement("
            INSERT INTO migrations (migration, batch) 
            VALUES (?, 2)
            ON CONFLICT (migration) DO NOTHING
        ", [$migration]);
    }
    
    echo "✅ Migration records updated\n";
    
    // Verify tables
    echo "\n🔍 Verification:\n";
    $plans = DB::table('plans')->count();
    $paymentMethods = DB::table('payment_methods')->count();
    echo "📋 Plans: {$plans} records\n";
    echo "💳 Payment methods: {$paymentMethods} records\n";
    echo "📊 Subscriptions table: created\n";
    echo "🛒 Orders table: created\n";
    
    echo "\n🎉 Database setup completed successfully!\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}
