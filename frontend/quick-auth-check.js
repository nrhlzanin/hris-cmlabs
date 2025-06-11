// Immediate authentication check for browser console
console.log('🔍 IMMEDIATE AUTH CHECK');
console.log('Current URL:', window.location.href);
console.log('localStorage auth_token:', localStorage.getItem('auth_token') ? 'EXISTS' : 'MISSING');
console.log('sessionStorage auth_token:', sessionStorage.getItem('auth_token') ? 'EXISTS' : 'MISSING');
console.log('localStorage user_data:', localStorage.getItem('user_data') ? 'EXISTS' : 'MISSING');
console.log('sessionStorage user_data:', sessionStorage.getItem('user_data') ? 'EXISTS' : 'MISSING');

const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
if (token) {
  console.log('✅ Token found:', token.substring(0, 20) + '...');
  
  // Quick token test
  fetch('http://localhost:8000/api/profile', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    }
  })
  .then(response => {
    console.log('Profile API status:', response.status);
    if (response.status === 401) {
      console.log('❌ Token expired or invalid - need to re-login');
      console.log('🔄 Solution: Go to /auth/sign-in and login again');
    } else if (response.ok) {
      console.log('✅ Token is valid');
    }
    return response.json();
  })
  .then(data => {
    if (data.success) {
      console.log('✅ User authenticated:', data.data.user.name);
    } else {
      console.log('❌ Auth failed:', data.message);
    }
  })
  .catch(error => {
    console.error('Auth test error:', error);
  });
  
} else {
  console.log('❌ No token found - user needs to login');
  console.log('🔄 Navigate to /auth/sign-in');
}
