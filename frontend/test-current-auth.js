// Test current authentication state and token retrieval
console.log('=== AUTHENTICATION TEST ===');

// Check if we're in browser environment
if (typeof window !== 'undefined') {
  console.log('Environment: Browser');
  
  // Check localStorage
  const localToken = localStorage.getItem('auth_token');
  const localUser = localStorage.getItem('user_data');
  console.log('localStorage auth_token:', localToken ? 'EXISTS' : 'NOT FOUND');
  console.log('localStorage user_data:', localUser ? 'EXISTS' : 'NOT FOUND');
  
  // Check sessionStorage
  const sessionToken = sessionStorage.getItem('auth_token');
  const sessionUser = sessionStorage.getItem('user_data');
  console.log('sessionStorage auth_token:', sessionToken ? 'EXISTS' : 'NOT FOUND');
  console.log('sessionStorage user_data:', sessionUser ? 'EXISTS' : 'NOT FOUND');
  
  // Test combined token retrieval (same as services)
  const combinedToken = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
  console.log('Combined token retrieval:', combinedToken ? 'SUCCESS' : 'FAILED');
  
  if (combinedToken) {
    console.log('Token starts with:', combinedToken.substring(0, 20) + '...');
  }
  
  // Test API call to overtime endpoint
  const testOvertimeAPI = async () => {
    try {
      console.log('\n=== TESTING OVERTIME API ===');
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      
      if (!token) {
        console.log('❌ No token found for API test');
        return;
      }
      
      const response = await fetch('http://localhost:8000/api/overtime/records?status=&per_page=50', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      console.log('API Response Status:', response.status);
      console.log('API Response Headers:', Object.fromEntries(response.headers.entries()));
      
      const data = await response.json();
      console.log('API Response Data:', data);
      
      if (response.ok) {
        console.log('✅ Overtime API call successful');
      } else {
        console.log('❌ Overtime API call failed:', data.message || 'Unknown error');
      }
      
    } catch (error) {
      console.log('❌ Error testing overtime API:', error.message);
    }
  };
  
  // Run the test after a short delay to ensure page is loaded
  setTimeout(testOvertimeAPI, 2000);
  
} else {
  console.log('Environment: Server-side');
}
