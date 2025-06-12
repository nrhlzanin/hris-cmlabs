// Test API Login and Employee Page Access
const testLogin = async () => {
  try {
    console.log('🔐 Testing Admin Login...');
    
    // Login to get token
    const loginResponse = await fetch('http://localhost:8000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        email: 'hr.manager@hris.com',
        password: 'HRManager123#'
      })
    });

    if (!loginResponse.ok) {
      console.log('❌ Login failed:', loginResponse.status);
      return;
    }

    const loginData = await loginResponse.json();
    const token = loginData.token;
    
    console.log('✅ Login successful!');
    console.log('🎫 Token:', token.substring(0, 20) + '...');

    // Now test employee API
    const employeeResponse = await fetch('http://localhost:8000/api/employees?per_page=5', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (employeeResponse.ok) {
      const employeeData = await employeeResponse.json();
      console.log('✅ Employee API successful!');
      console.log('📊 Statistics:');
      console.log('   Total Employees:', employeeData.stats.total_employees);
      console.log('   Men/Women:', employeeData.stats.men_count, '/', employeeData.stats.women_count);
      console.log('   Permanent/Contract:', employeeData.stats.permanent_count, '/', employeeData.stats.contract_count);
      console.log('👥 First employee:', employeeData.data.data[0]?.full_name);
      
      // Store token for frontend use
      console.log('\n🔑 To access frontend, use this token in browser localStorage:');
      console.log(`localStorage.setItem('auth_token', '${token}');`);
      
    } else {
      console.log('❌ Employee API failed:', employeeResponse.status);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

testLogin();
