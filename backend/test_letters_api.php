<?php
// Test letter API endpoints
$apiUrl = 'http://localhost:8000';

echo "=== LETTER API TEST ===\n";

// Test 1: Get letters without authentication
echo "1. Testing letters API without auth...\n";
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "$apiUrl/api/letters");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Accept: application/json']);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "GET /api/letters - Status: $httpCode\n";
echo "Response: " . substr($response, 0, 200) . "...\n\n";

// Test 2: Try to authenticate first
echo "2. Testing authentication...\n";
$loginData = json_encode(['email' => 'admin@cmlabs.com', 'password' => 'password123']);
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "$apiUrl/api/login");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $loginData);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json', 'Accept: application/json']);
$loginResponse = curl_exec($ch);
$loginHttpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "POST /api/login - Status: $loginHttpCode\n";
echo "Login Response: " . substr($loginResponse, 0, 200) . "...\n";

if ($loginHttpCode === 200) {
    $loginData = json_decode($loginResponse, true);
    if (isset($loginData['token'])) {
        $token = $loginData['token'];
        echo "✅ Authentication successful, token obtained.\n\n";
        
        // Test 3: Get letters with authentication
        echo "3. Testing authenticated letters API...\n";
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, "$apiUrl/api/letters");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Accept: application/json',
            'Authorization: Bearer ' . $token
        ]);
        $authResponse = curl_exec($ch);
        $authHttpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        echo "GET /api/letters (authenticated) - Status: $authHttpCode\n";
        echo "Response: " . substr($authResponse, 0, 400) . "...\n\n";
        
        if ($authHttpCode === 200) {
            $letterData = json_decode($authResponse, true);
            echo "✅ Letters API working! Found " . (isset($letterData['data']) ? count($letterData['data']) : 0) . " letters\n";
            
            // Test 4: Try to create a new letter
            echo "\n4. Testing letter creation...\n";
            $newLetter = json_encode([
                'employee_id' => 1,
                'letter_format_id' => 1,
                'reason' => 'Test letter from API',
                'start_date' => '2025-06-12',
                'end_date' => '2025-06-14'
            ]);
            
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, "$apiUrl/api/letters");
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $newLetter);
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                'Content-Type: application/json',
                'Accept: application/json',
                'Authorization: Bearer ' . $token
            ]);
            $createResponse = curl_exec($ch);
            $createHttpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);
            
            echo "POST /api/letters - Status: $createHttpCode\n";
            echo "Create Response: " . substr($createResponse, 0, 300) . "...\n";
            
            if ($createHttpCode === 201 || $createHttpCode === 200) {
                echo "✅ Letter creation working!\n";
            } else {
                echo "❌ Letter creation failed\n";
            }
        } else {
            echo "❌ Letters API failed with status $authHttpCode\n";
        }
    } else {
        echo "❌ Login failed - no token received\n";
    }
} else {
    echo "❌ Login failed with status $loginHttpCode\n";
}

echo "\n=== TEST COMPLETE ===\n";
?>
