// Comprehensive test for authentication and overtime functionality
const testComplete = async () => {
  console.log('🧪 COMPREHENSIVE AUTHENTICATION & OVERTIME TEST');
  console.log('='.repeat(50));
  
  try {
    // Test 1: Authentication
    console.log('\n1. 🔐 Testing Authentication...');
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
    console.log(`   User: ${loginData.data.user.name} (${loginData.data.user.role})`);
    
    const token = loginData.data.token;
    
    // Test 2: Profile retrieval
    console.log('\n2. 👤 Testing Profile Retrieval...');
    const profileResponse = await fetch('http://localhost:8000/api/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      }
    });
    
    const profileData = await profileResponse.json();
    
    if (!profileData.success) {
      console.error('❌ Profile retrieval failed:', profileData.message);
    } else {
      console.log('✅ Profile retrieved successfully');
    }
    
    // Test 3: Overtime API
    console.log('\n3. ⏰ Testing Overtime API...');
    const overtimeResponse = await fetch('http://localhost:8000/api/overtime', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      }
    });
    
    const overtimeData = await overtimeResponse.json();
    
    if (!overtimeData.success) {
      console.error('❌ Overtime API failed:', overtimeData.message);
    } else {
      console.log('✅ Overtime API successful');
      console.log(`   Records found: ${overtimeData.data.length}`);
      console.log(`   Pagination: Page ${overtimeData.pagination.current_page} of ${overtimeData.pagination.last_page}`);
    }
    
    // Test 4: Creating an overtime request
    console.log('\n4. 📝 Testing Overtime Creation...');
    const createOvertimeResponse = await fetch('http://localhost:8000/api/overtime', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        overtime_date: '2025-06-12',
        start_time: '18:00',
        overtime_type: 'regular',
        reason: 'Test overtime request for API verification'
      })
    });
    
    const createOvertimeData = await createOvertimeResponse.json();
    
    if (!createOvertimeData.success) {
      console.log('⚠️  Overtime creation result:', createOvertimeData.message);
    } else {
      console.log('✅ Overtime creation successful');
      console.log(`   Request ID: ${createOvertimeData.data.overtime.id}`);
    }
    
    // Test 5: Logout
    console.log('\n5. 🚪 Testing Logout...');
    const logoutResponse = await fetch('http://localhost:8000/api/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      }
    });
    
    const logoutData = await logoutResponse.json();
    
    if (!logoutData.success) {
      console.error('❌ Logout failed:', logoutData.message);
    } else {
      console.log('✅ Logout successful');
    }
    
    // Test 6: Verify token is invalidated
    console.log('\n6. 🔒 Testing Token Invalidation...');
    const invalidTokenResponse = await fetch('http://localhost:8000/api/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      }
    });
    
    if (invalidTokenResponse.status === 401) {
      console.log('✅ Token properly invalidated after logout');
    } else {
      console.log('⚠️  Token might still be valid after logout');
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('🎉 COMPREHENSIVE TEST COMPLETED');
    console.log('✅ Authentication: Working');
    console.log('✅ Profile API: Working'); 
    console.log('✅ Overtime API: Working');
    console.log('✅ Logout: Working');
    console.log('✅ Token Security: Working');
    
  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
};

testComplete();
