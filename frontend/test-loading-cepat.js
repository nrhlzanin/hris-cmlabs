// Test Loading Cepat Overtime Page
const testLoadingCepat = async () => {
  console.log('🚀 TEST LOADING CEPAT OVERTIME');
  console.log('===============================');
  
  try {
    // Login dulu
    console.log('1️⃣ Login...');
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
      console.error('❌ Login gagal:', loginData.message);
      return;
    }
    
    console.log(`✅ Login berhasil dalam ${loginTime}ms`);
    const token = loginData.data.token;
    
    // Test overtime API langsung tanpa delay
    console.log('\n2️⃣ Test Overtime API Langsung...');
    const overtimeStart = Date.now();
    
    const overtimeResponse = await fetch('http://localhost:8000/api/overtime?per_page=100&sort_by=overtime_date&sort_order=desc', {
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
      console.log(`✅ Data overtime loaded dalam ${overtimeTime}ms`);
      console.log(`📊 Total records: ${overtimeData.data.length}`);
      
      if (overtimeData.data.length > 0) {
        console.log('\n📋 Sample Data:');
        overtimeData.data.slice(0, 2).forEach((record, index) => {
          console.log(`   ${index + 1}. ${record.overtime_date} - ${record.reason} (${record.status})`);
        });
      }
      
    } else {
      console.log(`❌ Overtime API gagal: ${overtimeResponse.status}`);
    }
    
    // Test multiple requests tanpa throttling
    console.log('\n3️⃣ Test Multiple Requests Tanpa Delay...');
    const multiStart = Date.now();
    
    const promises = [];
    for (let i = 0; i < 5; i++) {
      promises.push(
        fetch('http://localhost:8000/api/overtime?per_page=10', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          }
        })
      );
    }
    
    const responses = await Promise.all(promises);
    const multiTime = Date.now() - multiStart;
    
    console.log(`⚡ 5 requests selesai dalam ${multiTime}ms`);
    console.log(`📊 Semua berhasil: ${responses.every(r => r.ok)}`);
    
    // Summary
    const totalTime = loginTime + overtimeTime;
    console.log('\n🎯 RINGKASAN PERFORMA:');
    console.log('======================');
    console.log(`🔐 Login: ${loginTime}ms`);
    console.log(`📊 Load Overtime: ${overtimeTime}ms`);
    console.log(`⚡ Multiple Requests: ${multiTime}ms`);
    console.log(`🕒 Total Time: ${totalTime}ms`);
    
    if (totalTime < 2000) {
      console.log('🎉 SANGAT CEPAT! (<2 detik)');
    } else if (totalTime < 3000) {
      console.log('✅ CEPAT! (<3 detik)');
    } else {
      console.log('⚠️ Masih agak lambat (>3 detik)');
    }
    
    console.log('\n🚀 OPTIMISASI SELESAI:');
    console.log('• ✅ Tidak ada throttling/delay');
    console.log('• ✅ Ambil 100 records sekaligus');
    console.log('• ✅ Loading sederhana tanpa skeleton');
    console.log('• ✅ API call langsung ke database');
    
    console.log('\n🔗 Test di browser:');
    console.log('   Frontend: http://localhost:3010/user/overtime');
    console.log('   Login: user1test@gmail.com / password123');
    
  } catch (error) {
    console.error('💥 Test gagal:', error);
  }
};

testLoadingCepat();
