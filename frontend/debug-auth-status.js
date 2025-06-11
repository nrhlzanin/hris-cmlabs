// Debug script to check authentication status and token validity
const debugAuth = async () => {
  console.log('🔍 DEBUGGING AUTHENTICATION STATUS');
  console.log('='.repeat(50));
  
  // Check token storage
  console.log('\n📱 Token Storage Check:');
  const localToken = localStorage.getItem('auth_token');
  const sessionToken = sessionStorage.getItem('auth_token');
  const combinedToken = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
  
  console.log('localStorage auth_token:', localToken ? 'EXISTS' : 'NOT FOUND');
  console.log('sessionStorage auth_token:', sessionToken ? 'EXISTS' : 'NOT FOUND');
  console.log('Combined token:', combinedToken ? 'EXISTS' : 'NOT FOUND');
  
  if (combinedToken) {
    console.log('Token preview:', combinedToken.substring(0, 30) + '...');
    
    // Test token validity with profile endpoint
    console.log('\n🔐 Token Validity Check:');
    try {
      const profileResponse = await fetch('http://localhost:8000/api/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${combinedToken}`,
          'Accept': 'application/json',
        }
      });
      
      console.log('Profile API Status:', profileResponse.status);
      
      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        console.log('✅ Token is VALID');
        console.log('User:', profileData.data.user.name);
        console.log('Email:', profileData.data.user.email);
        console.log('Role:', profileData.data.user.role);
      } else {
        const errorData = await profileResponse.json();
        console.log('❌ Token is INVALID');
        console.log('Error:', errorData.message);
        
        if (profileResponse.status === 401) {
          console.log('\n🚨 SOLUTION: User needs to login again');
          console.log('Navigate to /auth/sign-in to get a fresh token');
        }
      }
    } catch (error) {
      console.error('❌ Profile check failed:', error);
    }
    
    // Test attendance endpoint directly
    console.log('\n🕐 Attendance Endpoint Check:');
    try {
      const formData = new FormData();
      formData.append('latitude', '-7.9797');
      formData.append('longitude', '112.6304'); 
      formData.append('address', 'Test Address');
      
      const attendanceResponse = await fetch('http://localhost:8000/api/check-clock/break-start', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${combinedToken}`,
          'Accept': 'application/json'
        },
        body: formData
      });
      
      console.log('Attendance API Status:', attendanceResponse.status);
      const attendanceData = await attendanceResponse.json();
      console.log('Attendance Response:', attendanceData.message);
      
      if (attendanceResponse.status === 401) {
        console.log('❌ Attendance endpoint also returns 401 - token issue confirmed');
      } else {
        console.log('✅ Attendance endpoint accessible (may have business logic errors)');
      }
      
    } catch (error) {
      console.error('❌ Attendance check failed:', error);
    }
    
  } else {
    console.log('\n❌ No authentication token found');
    console.log('User needs to login at /auth/sign-in');
  }
  
  console.log('\n🔧 DEBUGGING COMPLETE');
  console.log('If token is invalid, user should:');
  console.log('1. Navigate to /auth/sign-in');
  console.log('2. Login with valid credentials');
  console.log('3. Return to /user/absensi');
  console.log('4. Try submitting form again');
};

// Run immediately if in browser
if (typeof window !== 'undefined') {
  debugAuth();
}
