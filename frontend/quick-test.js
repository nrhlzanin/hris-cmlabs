// Quick overtime API test
const API_BASE_URL = 'http://localhost:8000';

async function quickOvertimeTest() {
  console.log('🚀 Quick Overtime Test...');
  
  try {
    // Login first
    const loginStart = Date.now();
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
    
    const loginTime = Date.now() - loginStart;
    console.log(`⏱️ Login took: ${loginTime}ms`);
    
    if (!loginResponse.ok) {
      console.log('❌ Login failed');
      return;
    }
    
    const loginData = await loginResponse.json();
    const token = loginData.data.token;
    
    // Test overtime API speed
    const apiStart = Date.now();
    const overtimeResponse = await fetch(`${API_BASE_URL}/api/overtime?per_page=50`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    const apiTime = Date.now() - apiStart;
    console.log(`⏱️ Overtime API took: ${apiTime}ms`);
    
    if (overtimeResponse.ok) {
      const data = await overtimeResponse.json();
      console.log(`✅ Success: ${data.data.length} records found`);
      console.log(`📊 Data sample:`, data.data[0]);
    } else {
      console.log('❌ API failed:', await overtimeResponse.text());
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

quickOvertimeTest();
