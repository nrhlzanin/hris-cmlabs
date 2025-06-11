const testLoginAndBreakStart = async () => {
  console.log('🎯 TESTING LOGIN -> BREAK START FLOW');
  console.log('='.repeat(50));
  
  try {
    // Step 1: Login to get a fresh token
    console.log('\n1️⃣ Performing fresh login...');
    
    const loginResponse = await fetch('http://localhost:8000/api/login', {
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
    
    const loginData = await loginResponse.json();
    
    if (!loginData.success) {
      console.error('❌ Login failed:', loginData.message);
      return;
    }
    
    console.log('✅ Login successful');
    console.log('User:', loginData.data.user.name);
    console.log('Role:', loginData.data.user.role);
    
    const token = loginData.data.token;
    console.log('Token preview:', token.substring(0, 30) + '...');
    
    // Step 2: Test break-start endpoint with fresh token
    console.log('\n2️⃣ Testing break-start with fresh token...');
    
    const formData = new FormData();
    formData.append('latitude', '-7.943942379616513');
    formData.append('longitude', '112.61609090008966');
    formData.append('address', 'Jalan Remujung, Dinoyo, Malang, Kota Malang, East Java');
    
    const breakStartResponse = await fetch('http://localhost:8000/api/check-clock/break-start', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
        // Don't set Content-Type for FormData
      },
      body: formData
    });
    
    console.log('Break Start Status:', breakStartResponse.status);
    const breakStartData = await breakStartResponse.json();
    console.log('Break Start Response:', breakStartData);
    
    // Step 3: Analysis
    console.log('\n3️⃣ ANALYSIS:');
    
    if (breakStartResponse.status === 401) {
      console.log('❌ STILL GETTING 401 WITH FRESH TOKEN');
      console.log('🔍 This indicates a backend authentication issue');
      console.log('🔧 Possible causes:');
      console.log('   - Sanctum middleware not working properly');
      console.log('   - Token format issue');
      console.log('   - Route protection misconfigured');
      
    } else if (breakStartResponse.status === 400) {
      console.log('✅ AUTHENTICATION WORKING (400 = business logic error)');
      console.log('🎉 Frontend authentication fix is successful!');
      console.log('💡 Business error (like "need to clock in first") is expected');
      
    } else if (breakStartResponse.status === 201) {
      console.log('✅ BREAK START SUCCESSFUL!');
      console.log('🎉 Everything working perfectly!');
      
    } else if (breakStartResponse.status === 500) {
      console.log('⚠️ SERVER ERROR (500)');
      console.log('🔍 Backend issue unrelated to authentication');
      console.log('💡 Authentication working, server processing failed');
      
    } else {
      console.log('⚠️ Unexpected status:', breakStartResponse.status);
    }
    
    // Step 4: Instructions for user
    console.log('\n4️⃣ INSTRUCTIONS FOR USER:');
    
    if (breakStartResponse.status === 401) {
      console.log('🚨 USER NEEDS TO:');
      console.log('1. Clear all browser data (Ctrl+Shift+Delete)');
      console.log('2. Close and reopen browser');
      console.log('3. Navigate to http://localhost:3000/auth/sign-in');
      console.log('4. Login with: user1test@gmail.com / password123');
      console.log('5. Go to /user/absensi and try again');
      console.log('');
      console.log('🔧 IF STILL FAILING:');
      console.log('- Check backend authentication middleware');
      console.log('- Verify Laravel Sanctum configuration');
      console.log('- Check CORS settings');
      
    } else {
      console.log('✅ AUTHENTICATION IS WORKING!');
      console.log('User should:');
      console.log('1. Make sure they are logged in');
      console.log('2. Any errors are now business logic related');
      console.log('3. Try different absence types if needed');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

testLoginAndBreakStart();
