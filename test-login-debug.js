// Test API Login with debug
const testLoginDebug = async () => {
  try {
    console.log('🔐 Testing Admin Login with Debug...');
    
    // Test different credentials
    const credentials = [
      { email: 'hr.manager@hris.com', password: 'HRManager123#' },
      { email: 'super.admin@hris.com', password: 'SuperAdmin123#' },
      { email: 'it.admin@hris.com', password: 'ITAdmin123#' }
    ];

    for (const cred of credentials) {
      console.log(`\n🔑 Trying: ${cred.email}`);
      
      const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(cred)
      });

      const responseText = await response.text();
      
      console.log('Status:', response.status);
      console.log('Response:', responseText);

      if (response.ok) {
        const data = JSON.parse(responseText);
        console.log('✅ Login successful with:', cred.email);
        console.log('🎫 Token:', data.token?.substring(0, 30) + '...');
        return data.token;
      }
    }

    console.log('❌ All login attempts failed');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

testLoginDebug();
