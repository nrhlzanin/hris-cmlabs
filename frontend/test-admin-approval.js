/**
 * Test script for admin approval functionality
 * Tests the new admin endpoints for check-clock approval and manual entry
 */

const API_BASE_URL = 'http://localhost:8000';

async function testAdminApprovalFunctionality() {
  console.log('🎯 TESTING ADMIN APPROVAL FUNCTIONALITY');
  console.log('='.repeat(60));

  try {
    // Step 1: Login as admin
    console.log('\n1️⃣ Logging in as admin...');
    const loginResponse = await fetch(`${API_BASE_URL}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },      body: JSON.stringify({
        login: 'admin@hris.com', // Use admin credentials  
        password: 'Admin123#' // Correct password from seeder
      })
    });

    const loginData = await loginResponse.json();
    if (!loginData.success) {
      console.error('❌ Admin login failed:', loginData.message);
      return;
    }

    console.log('✅ Admin login successful');
    const token = loginData.data.token;

    // Step 2: Get attendance records to find one to test approval on
    console.log('\n2️⃣ Fetching attendance records...');
    const attendanceResponse = await fetch(`${API_BASE_URL}/api/check-clock`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });

    const attendanceData = await attendanceResponse.json();
    console.log('Attendance records response status:', attendanceResponse.status);
    
    if (attendanceData.success && attendanceData.data && attendanceData.data.length > 0) {
      console.log(`✅ Found ${attendanceData.data.length} attendance record groups`);
      
      // Find a record with individual check-clock entries
      let testRecordId = null;
      for (const dateGroup of attendanceData.data) {
        if (dateGroup.records && dateGroup.records.length > 0) {
          testRecordId = dateGroup.records[0].id;
          break;
        }
      }

      if (testRecordId) {
        console.log(`📝 Using record ID ${testRecordId} for approval tests`);

        // Step 3: Test approval endpoint
        console.log('\n3️⃣ Testing approval endpoint...');
        const approvalResponse = await fetch(`${API_BASE_URL}/api/check-clock/${testRecordId}/approve`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            admin_notes: 'Approved via test script'
          })
        });

        const approvalData = await approvalResponse.json();
        console.log('Approval response status:', approvalResponse.status);
        console.log('Approval response:', approvalData);

        if (approvalResponse.ok) {
          console.log('✅ Approval endpoint working correctly');
        } else {
          console.log('❌ Approval endpoint failed:', approvalData.message);
        }

        // Step 4: Test decline endpoint (on same record, should work if not already processed)
        console.log('\n4️⃣ Testing decline endpoint...');
        const declineResponse = await fetch(`${API_BASE_URL}/api/check-clock/${testRecordId}/decline`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            admin_notes: 'Declined via test script for testing purposes'
          })
        });

        const declineData = await declineResponse.json();
        console.log('Decline response status:', declineResponse.status);
        console.log('Decline response:', declineData);

        if (declineResponse.ok) {
          console.log('✅ Decline endpoint working correctly');
        } else {
          console.log('❌ Decline endpoint failed (expected if already approved):', declineData.message);
        }
      } else {
        console.log('⚠️ No individual check-clock records found to test approval on');
      }
    } else {
      console.log('⚠️ No attendance records found for approval testing');
    }    // Step 5: Test manual check-in endpoint
    console.log('\n5️⃣ Testing manual check-in endpoint...');
    
    // First, let's get a valid user ID by checking actual users
    const userResponse = await fetch(`${API_BASE_URL}/api/employees?per_page=5`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });

    const userData = await userResponse.json();
    let testUserId = null;

    if (userData.success && userData.data && userData.data.data && userData.data.data.length > 0) {
      // Get the first employee and find their corresponding user_id
      const employee = userData.data.data[0];
      console.log(`📝 Using employee: ${employee.full_name} (NIK: ${employee.nik})`);
        // Let's use a simple approach - use one of the known user IDs from our system
      // From the user check, we know user ID 10 exists for "User Test"
      testUserId = 10; // Use valid user ID
    } else {
      testUserId = 10; // fallback to known valid user ID
    }

    const manualCheckInData = {
      user_id: testUserId,
      check_clock_type: 'clock_in',
      check_clock_time: new Date().toISOString(),
      latitude: -7.9797,
      longitude: 112.6304,
      address: 'Test Address - Manual Check-in via script',
      admin_notes: 'Manual check-in created by test script'
    };

    const manualResponse = await fetch(`${API_BASE_URL}/api/check-clock/manual`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(manualCheckInData)
    });

    const manualData = await manualResponse.json();
    console.log('Manual check-in response status:', manualResponse.status);
    console.log('Manual check-in response:', manualData);

    if (manualResponse.ok) {
      console.log('✅ Manual check-in endpoint working correctly');
      
      // Test approval on the newly created record
      if (manualData.success && manualData.data && manualData.data.id) {
        console.log('\n6️⃣ Testing approval on manual check-in record...');
        const newRecordId = manualData.data.id;
        
        const approvalResponse = await fetch(`${API_BASE_URL}/api/check-clock/${newRecordId}/approve`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            admin_notes: 'Approved manual check-in via test script'
          })
        });

        const approvalData = await approvalResponse.json();
        console.log('Approval response status:', approvalResponse.status);
        console.log('Approval response:', approvalData);

        if (approvalResponse.ok) {
          console.log('✅ Approval of manual check-in working correctly');
        } else {
          console.log('❌ Approval of manual check-in failed:', approvalData.message);
        }
      }
    } else {
      console.log('❌ Manual check-in endpoint failed:', manualData.message);
      console.log('Error details:', manualData.errors);
    }

    console.log('\n🎉 Admin approval functionality testing completed!');

  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
}

// Run the test
testAdminApprovalFunctionality();
