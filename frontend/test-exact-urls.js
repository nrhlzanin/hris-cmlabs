// Detailed API URL test
const API_BASE_URL = 'http://localhost:8000';

async function testExactURL() {
  console.log('🔐 Testing exact API URLs...');
  
  try {
    // Login first
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
    
    const loginData = await loginResponse.json();
    const token = loginData.data.token;
    console.log('✅ Login successful');
    
    // Test different URLs to understand the routing
    const urlsToTest = [
      '/api/overtime',                              // Should work - index method
      '/api/overtime/',                             // Should work - index method 
      '/api/overtime?status=&per_page=50',          // Current failing URL
      '/api/overtime/?status=&per_page=50',         // Alternative
      '/api/overtime/1',                            // Should work - show method with valid ID
      '/api/overtime/records',                      // This is what might be causing issues
    ];
    
    for (const url of urlsToTest) {
      console.log(`\n🔍 Testing: ${url}`);
      try {
        const response = await fetch(`${API_BASE_URL}${url}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        
        console.log(`  Status: ${response.status}`);
        
        if (response.status === 200) {
          const data = await response.json();
          console.log(`  ✅ Success: ${data.data ? data.data.length : 0} records`);
        } else {
          const errorData = await response.json();
          console.log(`  ❌ Error: ${errorData.message || 'Unknown error'}`);
        }
        
      } catch (error) {
        console.log(`  ❌ Exception: ${error.message}`);
      }
    }
    
  } catch (error) {
    console.log('❌ Test failed:', error.message);
  }
}

testExactURL();
