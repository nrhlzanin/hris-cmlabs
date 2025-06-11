/**
 * Session Management Test Script
 * Run this in browser console to test session management features
 */

console.log('🔐 TESTING SESSION MANAGEMENT SYSTEM');
console.log('='.repeat(50));

// Test session management
const testSessionManagement = async () => {
  try {
    // Check if user is logged in
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
    if (!token) {
      console.log('❌ No authentication token found');
      console.log('Please login first at: http://localhost:3001/auth/sign-in');
      return;
    }

    console.log('✅ Authentication token found');
    console.log('Token preview:', token.substring(0, 30) + '...');

    // Test 1: Profile API
    console.log('\n1️⃣ Testing Profile API...');
    const profileResponse = await fetch('http://localhost:8000/api/profile', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      }
    });

    if (profileResponse.ok) {
      const profileData = await profileResponse.json();
      console.log('✅ Profile API working');
      console.log('User:', profileData.data.user.name);
      console.log('Role:', profileData.data.user.role);
    } else {
      console.log('❌ Profile API failed:', profileResponse.status);
      return;
    }

    // Test 2: Token Refresh
    console.log('\n2️⃣ Testing Token Refresh...');
    const refreshResponse = await fetch('http://localhost:8000/api/refresh-token', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      }
    });

    if (refreshResponse.ok) {
      const refreshData = await refreshResponse.json();
      console.log('✅ Token refresh working');
      console.log('New token preview:', refreshData.data.token.substring(0, 30) + '...');
      
      // Update token in storage for demo
      localStorage.setItem('auth_token', refreshData.data.token);
      sessionStorage.setItem('auth_token', refreshData.data.token);
    } else {
      console.log('❌ Token refresh failed:', refreshResponse.status);
    }

    // Test 3: Session Manager Functionality
    console.log('\n3️⃣ Testing Session Manager...');
    
    // Check if session manager is available
    if (typeof window !== 'undefined' && window.sessionManager) {
      console.log('✅ SessionManager available globally');
      
      // Test session data
      const sessionData = window.sessionManager.getSessionData();
      if (sessionData) {
        console.log('✅ Session data found');
        console.log('Time remaining:', window.sessionManager.getFormattedTimeRemaining());
        console.log('Session valid:', window.sessionManager.isSessionValid());
      } else {
        console.log('⚠️ No session data found - this is normal on first load');
      }
    } else {
      console.log('ℹ️ SessionManager not available globally (this is normal)');
    }

    // Test 4: Check Session Components
    console.log('\n4️⃣ Testing Session Components...');
    
    // Check if we're on a page with session context
    const sessionElements = document.querySelectorAll('[data-session-component]');
    if (sessionElements.length > 0) {
      console.log('✅ Session components found on page');
    } else {
      console.log('ℹ️ No session components on this page');
      console.log('Visit /user/session-demo to see session components');
    }

    // Final recommendations
    console.log('\n✅ SESSION MANAGEMENT TEST COMPLETE');
    console.log('📋 Recommendations:');
    console.log('1. Visit: http://localhost:3001/user/session-demo');
    console.log('2. Test session timeout by waiting or setting shorter timeout');
    console.log('3. Test activity tracking by interacting with the page');
    console.log('4. Test manual session extension');
    console.log('5. Monitor browser console for session events');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

// Run the test
testSessionManagement();

// Export test functions for manual testing
window.testSessionManagement = testSessionManagement;

console.log('\n🔧 Manual Test Functions Available:');
console.log('- testSessionManagement() - Run complete test suite');
console.log('- Navigate to /user/session-demo for interactive testing');
