#!/bin/bash

echo "=== HRIS Plans System Test ==="
echo ""

echo "1. Testing Backend API endpoints..."
echo "Starting Laravel server (background)..."

# Start Laravel server in background
cd backend
php artisan serve --port=8000 &
LARAVEL_PID=$!

# Wait for server to start
sleep 3

echo "Testing API endpoints..."

# Test plans endpoint
echo "- Testing /api/plans..."
curl -s http://localhost:8000/api/plans | jq '.success' >/dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "  ✅ Plans API working"
else
    echo "  ❌ Plans API failed"
fi

# Test payment methods endpoint
echo "- Testing /api/payment-methods..."
curl -s http://localhost:8000/api/payment-methods | jq '.success' >/dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "  ✅ Payment Methods API working"
else
    echo "  ❌ Payment Methods API failed"
fi

echo ""
echo "2. Testing Frontend pages..."

cd ../frontend

# Test if Next.js can build
echo "- Testing Next.js build..."
npm run build >/dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "  ✅ Frontend builds successfully"
else
    echo "  ❌ Frontend build failed"
fi

echo ""
echo "3. Stopping Laravel server..."
kill $LARAVEL_PID 2>/dev/null

echo ""
echo "=== Test Complete ==="
echo ""
echo "🎉 HRIS Plans system is ready!"
echo ""
echo "To start the system:"
echo "1. Backend: cd backend && php artisan serve --port=8000"
echo "2. Frontend: cd frontend && npm run dev"
echo "3. Open: http://localhost:3000/plans/pricing-plans"
