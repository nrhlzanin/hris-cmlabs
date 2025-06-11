const testApi = async () => {
  console.log('Testing authentication and overtime API...');
  
  try {
    // Test login first
    const loginResponse = await fetch('http://localhost:8000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },      body: JSON.stringify({
        login: 'user1test@gmail.com',
        password: 'password123'
      })
    });
    
    const loginData = await loginResponse.json();
    console.log('Login response:', loginData);
    
    if (!loginData.success) {
      console.error('Login failed:', loginData.message);
      return;
    }
    
    const token = loginData.data.token;
    console.log('Token obtained:', token.substring(0, 20) + '...');
    
    // Test overtime API
    const overtimeResponse = await fetch('http://localhost:8000/api/overtime', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });
    
    const overtimeData = await overtimeResponse.json();
    console.log('Overtime response status:', overtimeResponse.status);
    console.log('Overtime response:', overtimeData);
    
    // Test logout
    const logoutResponse = await fetch('http://localhost:8000/api/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });
    
    const logoutData = await logoutResponse.json();
    console.log('Logout response status:', logoutResponse.status);
    console.log('Logout response:', logoutData);
    
  } catch (error) {
    console.error('Test failed:', error);
  }
};

testApi();
