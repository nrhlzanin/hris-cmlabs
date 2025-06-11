// Complete end-to-end test simulating the frontend application flow
const API_BASE_URL = 'http://localhost:8000';

async function simulateCompleteUserFlow() {
  console.log('🎯 Starting Complete User Flow Simulation...');
  
  try {
    // Step 1: Login
    console.log('\n🔐 Step 1: User Login');
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
    console.log('✅ Login successful');
    
    // Step 2: Simulate frontend token storage
    console.log('\n💾 Step 2: Storing token (simulating frontend)');
    // This simulates what the frontend does
    const authToken = token;
    console.log('Token to be stored:', authToken.substring(0, 20) + '...');
    
    // Step 3: Test the exact API call the frontend makes
    console.log('\n📋 Step 3: Testing exact frontend API call');
    
    // This is exactly what the frontend does:
    // 1. getOvertimeRecords with filters
    // 2. Constructs query params
    // 3. Calls apiRequest with /overtime endpoint
    
    const filters = {
      status: undefined,
      per_page: 50
    };
    
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });
    
    const url = `/overtime${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const fullUrl = `${API_BASE_URL}/api${url}`;
    
    console.log('Constructed URL:', fullUrl);
    
    const overtimeResponse = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Response status:', overtimeResponse.status);
    console.log('Response headers:', Object.fromEntries(overtimeResponse.headers.entries()));
    
    if (overtimeResponse.ok) {
      const data = await overtimeResponse.json();
      console.log('✅ Overtime API call successful');
      console.log('Response structure:', {
        success: data.success,
        dataType: Array.isArray(data.data) ? 'array' : typeof data.data,
        recordCount: Array.isArray(data.data) ? data.data.length : 'N/A',
        hasNext: data.links?.next ? 'yes' : 'no',
        hasPrev: data.links?.prev ? 'yes' : 'no'
      });
      
      if (Array.isArray(data.data) && data.data.length > 0) {
        console.log('📊 Sample record structure:', Object.keys(data.data[0]));
      } else {
        console.log('📊 No overtime records found (empty dataset)');
      }
      
    } else {
      const errorData = await overtimeResponse.json();
      console.log('❌ Overtime API call failed');
      console.log('Error data:', errorData);
    }
    
    // Step 4: Test other overtime endpoints
    console.log('\n🔍 Step 4: Testing other overtime endpoints');
    
    const endpointsToTest = [
      '/api/overtime/timezone-info',
      '/api/overtime', // Without query params
    ];
    
    for (const endpoint of endpointsToTest) {
      console.log(`\nTesting: ${endpoint}`);
      try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Accept': 'application/json',
          }
        });
        console.log(`Status: ${response.status} ${response.ok ? '✅' : '❌'}`);
      } catch (error) {
        console.log(`Error: ${error.message} ❌`);
      }
    }
    
    console.log('\n🎉 Complete flow test finished!');
    
  } catch (error) {
    console.log('❌ Flow test failed:', error.message);
    console.error(error);
  }
}

// Run the simulation
simulateCompleteUserFlow();
