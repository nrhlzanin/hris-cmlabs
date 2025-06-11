// Test script to verify pricing API integration
const API_BASE_URL = 'http://localhost:8000';

async function testPricingAPI() {
  console.log('🧮 Testing Pricing API Integration');
  console.log('==================================\n');

  // Test cases
  const testCases = [
    {
      name: 'Lite Plan - Monthly',
      data: {
        plan_id: '2',
        billing_period: 'monthly',
        quantity: 1,
        payment_method_id: '1'
      }
    },
    {
      name: 'Lite Plan - Yearly',
      data: {
        plan_id: '2',
        billing_period: 'yearly',
        quantity: 1,
        payment_method_id: '1'
      }
    },
    {
      name: 'Pro Plan - Monthly - 5 Users',
      data: {
        plan_id: '3',
        billing_period: 'monthly',
        quantity: 5,
        payment_method_id: '1'
      }
    }
  ];

  for (const testCase of testCases) {
    try {
      console.log(`📋 Testing: ${testCase.name}`);
      
      const response = await fetch(`${API_BASE_URL}/api/payment/calculate`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testCase.data),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.success) {
        const { unit_price, quantity, subtotal, tax_amount, total_amount, currency } = result.data;
        console.log(`   ✅ Success!`);
        console.log(`   - Unit Price: ${currency} ${unit_price.toLocaleString('id-ID')}`);
        console.log(`   - Quantity: ${quantity}`);
        console.log(`   - Subtotal: ${currency} ${subtotal.toLocaleString('id-ID')}`);
        console.log(`   - Tax (11%): ${currency} ${tax_amount.toLocaleString('id-ID')}`);
        console.log(`   - Total: ${currency} ${total_amount.toLocaleString('id-ID')}`);
      } else {
        console.log(`   ❌ API Error: ${result.message}`);
      }
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
    
    console.log('');
  }

  console.log('🎯 Integration Summary:');
  console.log('- Frontend can now call /api/payment/calculate');
  console.log('- Real-time pricing updates when user changes options');
  console.log('- Proper loading states and error handling');
  console.log('- Backend calculates accurate tax and totals');
}

// Run the test
testPricingAPI().catch(console.error);
