// Quick verification test for the fixed overtime system
const API_BASE_URL = 'http://localhost:8000';

async function testOptimizedOvertimeAPI() {
  console.log('🚀 Testing Optimized Overtime System...');
  
  try {
    const startTime = Date.now();
    
    // Test login
    console.log('🔐 Step 1: Login...');
    const loginResponse = await fetch(`${API_BASE_URL}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        login: 'test@test.com',
        password: 'test123',
        remember: true
      })
    });
    
    if (!loginResponse.ok) {
      console.log('❌ Login failed');
      return;
    }
    
    const loginData = await loginResponse.json();
    const token = loginData.data.token;
    const loginTime = Date.now() - startTime;
    console.log(`✅ Login successful in ${loginTime}ms`);
    
    // Test single overtime API call
    console.log('📋 Step 2: Single overtime API call...');
    const apiStartTime = Date.now();
    
    const overtimeResponse = await fetch(`${API_BASE_URL}/api/overtime?per_page=50`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    const apiTime = Date.now() - apiStartTime;
    console.log(`⏱️ API response time: ${apiTime}ms`);
    
    if (overtimeResponse.ok) {
      const data = await overtimeResponse.json();
      console.log(`✅ Success: ${data.data.length} overtime records retrieved`);
      console.log(`📊 Response structure: ${JSON.stringify(Object.keys(data), null, 2)}`);
      
      if (data.data.length > 0) {
        console.log(`📝 Sample record: ${JSON.stringify(data.data[0], null, 2)}`);
      }
      
    } else {
      const errorData = await overtimeResponse.json();
      console.log('❌ API failed:', errorData);
    }
    
    const totalTime = Date.now() - startTime;
    console.log(`\n🎯 Total test time: ${totalTime}ms`);
    console.log(`${totalTime < 3000 ? '✅ FAST' : '⚠️ SLOW'} - ${totalTime < 3000 ? 'System optimized successfully!' : 'May need further optimization'}`);
    
  } catch (error) {
    console.log('❌ Test failed:', error.message);
  }
}

testOptimizedOvertimeAPI();
