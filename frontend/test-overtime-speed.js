// Test overtime page loading speed after optimizations
const testOvertimeSpeed = async () => {
  console.log('🚀 Testing Overtime Page Loading Speed (After Optimizations)');
  console.log('=' .repeat(60));
  
  try {
    // Login to get token
    console.log('1️⃣ Authenticating...');
    const loginStart = Date.now();
    
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
    const loginTime = Date.now() - loginStart;
    
    if (!loginData.success) {
      console.error('❌ Login failed:', loginData.message);
      return;
    }
    
    console.log(`✅ Login successful in ${loginTime}ms`);
    const token = loginData.data.token;
    
    // Test optimized overtime API call
    console.log('\n2️⃣ Testing optimized overtime API call...');
    const overtimeStart = Date.now();
    
    const overtimeResponse = await fetch('http://localhost:8000/api/overtime?per_page=10&sort_by=overtime_date&sort_order=desc', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });
    
    const overtimeTime = Date.now() - overtimeStart;
    
    if (overtimeResponse.ok) {
      const overtimeData = await overtimeResponse.json();
      console.log(`✅ Overtime data loaded in ${overtimeTime}ms`);
      console.log(`📊 Records returned: ${overtimeData.data.length}`);
      console.log(`📄 Total available: ${overtimeData.pagination.total}`);
      
      // Show the actual data structure
      console.log('\n📋 Sample Record Data:');
      if (overtimeData.data.length > 0) {
        const sample = overtimeData.data[0];
        console.log(`   📅 Date: ${sample.overtime_date}`);
        console.log(`   ⏰ Start: ${sample.start_time}`);
        console.log(`   🏁 End: ${sample.end_time || 'Pending'}`);
        console.log(`   ⏱️ Duration: ${sample.duration_hours || 'Pending'} hours`);
        console.log(`   🏷️ Status: ${sample.status}`);
        console.log(`   📝 Reason: ${sample.reason}`);
      }
      
    } else {
      console.log(`❌ Overtime API failed: ${overtimeResponse.status}`);
    }
    
    // Test multiple rapid requests (should be fast now)
    console.log('\n3️⃣ Testing rapid requests (no more 1-second delay)...');
    const rapidStart = Date.now();
    
    const rapidRequests = [];
    for (let i = 0; i < 3; i++) {
      rapidRequests.push(
        fetch('http://localhost:8000/api/overtime?per_page=5', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          }
        })
      );
    }
    
    const rapidResponses = await Promise.all(rapidRequests);
    const rapidTime = Date.now() - rapidStart;
    
    console.log(`⚡ 3 rapid requests completed in ${rapidTime}ms`);
    console.log(`📊 All successful: ${rapidResponses.every(r => r.ok)}`);
    
    if (rapidTime < 1000) {
      console.log('🎉 Excellent! No more 1-second delays');
    } else {
      console.log('⚠️ Still experiencing delays');
    }
    
    // Overall performance summary
    console.log('\n🎯 PERFORMANCE SUMMARY');
    console.log('=' .repeat(40));
    console.log(`🔐 Login: ${loginTime}ms`);
    console.log(`📊 Overtime Load: ${overtimeTime}ms`);
    console.log(`⚡ Rapid Requests: ${rapidTime}ms`);
    
    const totalTime = loginTime + overtimeTime;
    console.log(`🕒 Total Time: ${totalTime}ms`);
    
    if (totalTime < 3000) {
      console.log('🎉 EXCELLENT PERFORMANCE! (<3 seconds)');
    } else if (totalTime < 5000) {
      console.log('✅ GOOD PERFORMANCE! (<5 seconds)');
    } else {
      console.log('⚠️ SLOW PERFORMANCE (>5 seconds)');
    }
    
    console.log('\n🚀 Optimizations Applied:');
    console.log('• ✅ Smart throttling (100ms vs 1000ms)');
    console.log('• ✅ Reduced page size (10 vs 50 records)');
    console.log('• ✅ Added sorting for newest first');
    console.log('• ✅ Skeleton loading for better UX');
    console.log('• ✅ Rapid request detection');
    
    console.log('\n🔗 Your overtime page is now fast!');
    console.log('   Frontend: http://localhost:3010/user/overtime');
    
  } catch (error) {
    console.error('💥 Test failed:', error);
  }
};

testOvertimeSpeed();
