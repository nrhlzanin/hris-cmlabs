// Test the frontend API call and data transformation
const API_BASE_URL = 'http://localhost:8000';

async function testAdminCheckClockAPI() {
  console.log('=== Testing Admin CheckClock API ===');
  
  // Get auth token (assuming it exists in localStorage)
  const token = localStorage.getItem('auth_token') || 'test-token';
  
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };
  
  try {
    // Test 1: Direct API call without filters
    console.log('\n1. Testing direct API call to /api/check-clock:');
    const url = `${API_BASE_URL}/api/check-clock`;
    
    console.log('URL:', url);
    console.log('Headers:', headers);
    
    const response = await fetch(url, {
      method: 'GET',
      headers,
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      const data = await response.json();
      console.log('Response data structure:');
      console.log('- success:', data.success);
      console.log('- data count:', data.data ? data.data.length : 'no data');
      console.log('- pagination:', data.pagination);
      
      if (data.data && data.data.length > 0) {
        console.log('\nFirst item structure:');
        const firstItem = data.data[0];
        console.log(firstItem);
        
        console.log('\nSample data analysis:');
        console.log('- Date:', firstItem.date);
        console.log('- Records count:', firstItem.records ? firstItem.records.length : 'no records');
        
        if (firstItem.records && firstItem.records.length > 0) {
          console.log('- First record:', firstItem.records[0]);
        }
      } else {
        console.log('\n❌ NO DATA RETURNED!');
      }
    } else {
      const errorText = await response.text();
      console.log('❌ API Error:', response.status, errorText);
    }
    
    // Test 2: Test with pagination
    console.log('\n2. Testing with pagination parameters:');
    const paginatedUrl = `${API_BASE_URL}/api/check-clock?page=1&per_page=15`;
    
    const paginatedResponse = await fetch(paginatedUrl, {
      method: 'GET',
      headers,
    });
    
    console.log('Paginated response status:', paginatedResponse.status);
    
    if (paginatedResponse.ok) {
      const paginatedData = await paginatedResponse.json();
      console.log('Paginated data count:', paginatedData.data ? paginatedData.data.length : 'no data');
    }
    
    // Test 3: Test with date range
    console.log('\n3. Testing with explicit date range:');
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000));
    
    const dateFrom = thirtyDaysAgo.toISOString().split('T')[0];
    const dateTo = today.toISOString().split('T')[0];
    
    const dateRangeUrl = `${API_BASE_URL}/api/check-clock?date_from=${dateFrom}&date_to=${dateTo}&page=1&per_page=15`;
    
    console.log('Date range URL:', dateRangeUrl);
    
    const dateRangeResponse = await fetch(dateRangeUrl, {
      method: 'GET',
      headers,
    });
    
    console.log('Date range response status:', dateRangeResponse.status);
    
    if (dateRangeResponse.ok) {
      const dateRangeData = await dateRangeResponse.json();
      console.log('Date range data count:', dateRangeData.data ? dateRangeData.data.length : 'no data');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testAdminCheckClockAPI();
