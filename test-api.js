const axios = require('axios');

async function testCheckClockAPI() {
    console.log('=== Testing CheckClock API ===');
    
    const baseURL = 'http://127.0.0.1:8000';
    
    try {
        // Test without authentication first to see the structure
        console.log('Testing API endpoint structure...');
        
        const response = await axios.get(`${baseURL}/api/check-clock`, {
            validateStatus: () => true, // Accept any status code
        });
        
        console.log('Status:', response.status);
        console.log('Response data:', JSON.stringify(response.data, null, 2));
        
        if (response.status === 401) {
            console.log('\n✓ API is working but requires authentication (expected)');
        } else if (response.status === 200) {
            console.log('\n✓ API is working and returned data');
        } else {
            console.log('\n❌ Unexpected response status');
        }
        
    } catch (error) {
        console.error('Error testing API:', error.message);
    }
}

testCheckClockAPI();
