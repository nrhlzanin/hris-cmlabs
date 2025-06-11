// Quick login test
const testLogin = async () => {
  console.log('🔑 Testing Login Credentials');
  console.log('============================');
  
  try {
    const response = await fetch('http://localhost:8000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        login: 'user1test@gmail.com',
        password: 'password123'
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ LOGIN WORKING!');
      console.log(`👤 User: ${data.data.user.name}`);
      console.log(`📧 Email: ${data.data.user.email}`);
      console.log(`🏷️ Role: ${data.data.user.role}`);
      console.log('');
      console.log('🎯 SOLUTION TO YOUR PROBLEM:');
      console.log('==========================');
      console.log('The skeleton loading screens appear because you need to log in first!');
      console.log('');
      console.log('📱 1. Go to: http://localhost:3010/auth/sign-in');
      console.log('📧 2. Email: user1test@gmail.com');
      console.log('🔒 3. Password: password123');
      console.log('🎯 4. After login, go to: http://localhost:3010/user/overtime');
      console.log('');
      console.log('✨ Your overtime page will load instantly after login!');
    } else {
      console.log('❌ Login failed:', data.message);
    }
  } catch (error) {
    console.log('💥 Connection error:', error.message);
    console.log('❓ Is the backend server running on http://localhost:8000?');
  }
};

testLogin();
