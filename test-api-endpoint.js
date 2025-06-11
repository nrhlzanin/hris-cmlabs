// Test API Endpoint
const testAPI = async () => {
  try {
    // First, let's get a token by simulating login
    console.log('🔐 Testing Employee API...');
    
    const response = await fetch('http://localhost:8000/api/employees?per_page=5', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        // You might need to add authorization token here if required
      }
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ API Response successful!');
      console.log('📊 Statistics:', data.stats);
      console.log('👥 Employee count:', data.data.data.length);
      console.log('📄 Sample employee:', data.data.data[0]);
    } else {
      console.log('❌ API Response failed:', response.status, response.statusText);
      const errorText = await response.text();
      console.log('Error details:', errorText);
    }
  } catch (error) {
    console.error('❌ Network error:', error);
  }
};

testAPI();
