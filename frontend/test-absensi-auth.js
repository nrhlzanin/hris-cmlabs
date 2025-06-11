const testAbsensiAuth = async () => {
  try {
    console.log('Testing absensi authentication...');
      // Test login first
    const loginResponse = await fetch('http://localhost:8000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },      body: JSON.stringify({
        login: 'user1test@gmail.com',
        password: 'password'
      })
    });
    
    console.log('Login response status:', loginResponse.status);
    const loginData = await loginResponse.json();
    console.log('Login response:', loginData);
    
    if (loginData.access_token) {
      console.log('Token received, testing attendance endpoints...');
      
      // Test each attendance endpoint
      const endpoints = [
        '/api/check-clock/clock-in',
        '/api/check-clock/clock-out', 
        '/api/check-clock/break-start',
        '/api/check-clock/break-end'
      ];
      
      for (const endpoint of endpoints) {
        console.log(`\nTesting ${endpoint}...`);
        
        const formData = new FormData();
        formData.append('latitude', '-7.9797');
        formData.append('longitude', '112.6304');
        formData.append('address', 'Test Address Malang');
        
        const attendanceResponse = await fetch(`http://localhost:8000${endpoint}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${loginData.access_token}`,
            'Accept': 'application/json'
          },
          body: formData
        });
        
        console.log(`${endpoint} response status:`, attendanceResponse.status);
        const attendanceData = await attendanceResponse.json();
        console.log(`${endpoint} response:`, attendanceData);
      }
    }
  } catch (error) {
    console.error('Test error:', error);
  }
};

testAbsensiAuth();
