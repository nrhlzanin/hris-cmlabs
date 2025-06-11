// Test the actual frontend application overtime page
console.log('🌐 Testing Frontend Application...');

// Simulate going to the overtime page after login
const testFrontendOvertimePage = async () => {
  try {
    console.log('📱 Checking if we can access the overtime page...');
    
    // First, let's check what's in localStorage/sessionStorage
    console.log('\n💾 Current Storage State:');
    console.log('localStorage auth_token:', localStorage.getItem('auth_token') ? 'EXISTS' : 'NOT FOUND');
    console.log('sessionStorage auth_token:', sessionStorage.getItem('auth_token') ? 'EXISTS' : 'NOT FOUND');
    
    // Test the overtime service directly
    if (window.overtimeService) {
      console.log('\n🔧 Testing overtimeService directly...');
      const records = await window.overtimeService.getOvertimeRecords({
        status: undefined,
        per_page: 50
      });
      console.log('✅ Overtime service call successful:', records);
    } else {
      console.log('\n⚠️ overtimeService not available on window object');
      
      // Manual API test using the same pattern as the frontend
      console.log('🔧 Manual API test...');
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      
      if (!token) {
        console.log('❌ No authentication token found');
        return;
      }
      
      const response = await fetch('http://localhost:8000/api/overtime?status=&per_page=50', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      if (response.ok) {
        console.log('✅ Manual API call successful');
      } else {
        console.log('❌ Manual API call failed:', data.message);
      }
    }
    
  } catch (error) {
    console.log('❌ Error testing frontend:', error.message);
    console.log('Stack trace:', error.stack);
  }
};

// Run the test
testFrontendOvertimePage();

// Also check the current page
console.log('Current page URL:', window.location.href);
console.log('Current page pathname:', window.location.pathname);
