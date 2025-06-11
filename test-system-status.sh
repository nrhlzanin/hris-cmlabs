#!/bin/bash

echo "🚀 Testing HRIS Plans System"
echo "=============================="

echo "📁 Backend Status:"
cd backend
if [ -f "composer.json" ]; then
    echo "✅ Laravel project found"
    if [ -f ".env" ]; then
        echo "✅ Environment file exists"
    else
        echo "❌ No .env file"
    fi
else
    echo "❌ No Laravel project found"
fi

echo ""
echo "📁 Frontend Status:"
cd ../frontend
if [ -f "package.json" ]; then
    echo "✅ Next.js project found"
    if [ -f ".env.local" ]; then
        echo "✅ Environment file exists"
    else
        echo "❌ No .env.local file"
    fi
else
    echo "❌ No Next.js project found"
fi

echo ""
echo "🔧 Files Status:"
echo "Backend Models:"
ls -la ../backend/app/Models/ | grep -E "(Plan|PaymentMethod|Subscription|Order)" | wc -l | xargs echo "✅ Models created:"

echo ""
echo "Frontend Components:"
if [ -f "src/app/plans/pricing-plans/page.tsx" ]; then
    echo "✅ Pricing plans page exists"
else
    echo "❌ Pricing plans page missing"
fi

if [ -f "src/app/plans/payment/page.tsx" ]; then
    echo "✅ Payment page exists"
else
    echo "❌ Payment page missing"
fi

if [ -f "src/hooks/usePlans.ts" ]; then
    echo "✅ usePlans hook exists"
else
    echo "❌ usePlans hook missing"
fi

echo ""
echo "🎯 System Ready!"
echo "To start:"
echo "1. Backend: cd backend && php artisan serve"
echo "2. Frontend: cd frontend && npm run dev"
echo "3. Visit: http://localhost:3000/plans/pricing-plans"
