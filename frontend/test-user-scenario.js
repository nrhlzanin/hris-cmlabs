// Test the exact scenario the user is experiencing
const testUserScenario = async () => {
  console.log('🎯 TESTING USER SCENARIO: Break Start Submission');
  console.log('='.repeat(50));
  
  try {
    // Step 1: Check if user is logged in
    console.log('\n1️⃣ Checking authentication status...');
    
    const localToken = localStorage.getItem('auth_token');
    const sessionToken = sessionStorage.getItem('auth_token');
    const combinedToken = localToken || sessionToken;
    
    console.log('localStorage token:', localToken ? 'FOUND' : 'MISSING');
    console.log('sessionStorage token:', sessionToken ? 'FOUND' : 'MISSING');
    
    if (!combinedToken) {
      console.log('❌ NO TOKEN FOUND - User needs to login');
      console.log('🔄 Solution: Navigate to /auth/sign-in and login');
      return;
    }
    
    console.log('✅ Token found');
    
    // Step 2: Test token validity
    console.log('\n2️⃣ Testing token validity...');
    
    const profileTest = await fetch('http://localhost:8000/api/profile', {
      headers: {
        'Authorization': `Bearer ${combinedToken}`,
        'Accept': 'application/json'
      }
    });
    
    console.log('Profile API Status:', profileTest.status);
    
    if (profileTest.status === 401) {
      console.log('❌ TOKEN EXPIRED/INVALID');
      console.log('🔄 Solution: User needs to re-login');
      return;
    } else if (profileTest.ok) {
      const profileData = await profileTest.json();
      console.log('✅ Token valid - User:', profileData.data.user.name);
    }
    
    // Step 3: Test the exact API call that's failing
    console.log('\n3️⃣ Testing break-start endpoint (same as user form)...');
    
    const formData = new FormData();
    formData.append('latitude', '-7.943942379616513');  // Same as user's form
    formData.append('longitude', '112.61609090008966'); // Same as user's form
    formData.append('address', 'Jalan Remujung, Dinoyo, Malang, Kota Malang, East Java, Java, 65'); // Same as user's form
    
    const breakStartTest = await fetch('http://localhost:8000/api/check-clock/break-start', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${combinedToken}`,
        'Accept': 'application/json'
        // Note: Not setting Content-Type for FormData
      },
      body: formData
    });
    
    console.log('Break Start API Status:', breakStartTest.status);
    const breakStartData = await breakStartTest.json();
    console.log('Break Start Response:', breakStartData);
    
    if (breakStartTest.status === 401) {
      console.log('❌ BREAK START ENDPOINT RETURNS 401');
      console.log('This confirms the user\'s issue');
      
      // Check if it's a token format issue
      console.log('\n🔍 Checking token format...');
      console.log('Token starts with:', combinedToken.substring(0, 10));
      console.log('Token length:', combinedToken.length);
      
    } else if (breakStartTest.status === 400) {
      console.log('✅ Authentication working (400 = business logic error)');
      console.log('Error:', breakStartData.message);
    } else if (breakStartTest.status === 201) {
      console.log('✅ Break start successful!');
    } else {
      console.log('⚠️ Unexpected status:', breakStartTest.status);
    }
    
    // Step 4: Recommendations
    console.log('\n4️⃣ RECOMMENDATIONS:');
    
    if (breakStartTest.status === 401) {
      console.log('🔧 IMMEDIATE FIXES TO TRY:');
      console.log('1. Clear browser storage and re-login');
      console.log('2. Check if token is being sent correctly');
      console.log('3. Verify backend authentication middleware');
      console.log('');
      console.log('🔄 USER ACTIONS:');
      console.log('1. Go to /auth/sign-in');
      console.log('2. Login again with fresh credentials');
      console.log('3. Return to /user/absensi');
      console.log('4. Try form submission again');
    } else {
      console.log('✅ Authentication appears to be working');
      console.log('Any errors are likely business logic related');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

testUserScenario();
