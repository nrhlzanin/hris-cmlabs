// Test authentication flow and overtime API directly
const API_BASE_URL = 'http://localhost:8000';

async function testAuthFlow() {
  console.log('🔐 Starting authentication test...');
  
  try {
    // Test login with known credentials
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
    
    console.log('Login response status:', loginResponse.status);
    const loginData = await loginResponse.json();
    console.log('Login response:', loginData);
    
    if (loginResponse.ok && loginData.success && loginData.data?.token) {
      const token = loginData.data.token;
      console.log('✅ Login successful, token obtained:', token.substring(0, 20) + '...');
      
      // Test overtime API with the token
      console.log('\n📋 Testing overtime API...');
      const overtimeResponse = await fetch(`${API_BASE_URL}/api/overtime/records?status=&per_page=50`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Overtime API response status:', overtimeResponse.status);
      const overtimeData = await overtimeResponse.json();
      console.log('Overtime API response:', overtimeData);
      
      if (overtimeResponse.ok) {
        console.log('✅ Overtime API call successful');
        console.log('📊 Number of overtime records:', overtimeData.data?.length || 0);
      } else {
        console.log('❌ Overtime API call failed:', overtimeData.message || 'Unknown error');
      }
      
    } else {
      console.log('❌ Login failed:', loginData.message || 'Unknown error');
    }
    
  } catch (error) {
    console.log('❌ Test failed with error:', error.message);
  }
}

// Run the test
testAuthFlow();
