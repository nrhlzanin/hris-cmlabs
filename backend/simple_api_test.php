<?php
echo "=== Testing HRIS Letter API ===\n\n";

$baseUrl = 'http://127.0.0.1:8001/api';

// Test 1: Login
echo "1. Testing Login\n";
$loginData = json_encode([
    'login' => 'admin@cmlabs.com',
    'password' => 'password123'
]);

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $baseUrl . '/login');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $loginData);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Accept: application/json'
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
echo "HTTP Status: $httpCode\n";
echo "Response: $response\n\n";

$loginResult = json_decode($response, true);

if ($httpCode === 200 && isset($loginResult['data']['token'])) {
    $token = $loginResult['data']['token'];
    echo "Login successful! Token: " . substr($token, 0, 20) . "...\n\n";
      // Test 2: Get Letters
    echo "2. Testing Get Letters\n";
    
    // Reset curl options for GET request
    curl_reset($ch);
    curl_setopt($ch, CURLOPT_URL, $baseUrl . '/letters');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Accept: application/json',
        'Authorization: Bearer ' . $token
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    echo "HTTP Status: $httpCode\n";
    echo "Response: $response\n\n";
    
    $lettersResult = json_decode($response, true);
    
    if ($httpCode === 200 && isset($lettersResult['data'])) {
        echo "Letters retrieved successfully!\n";
        echo "Letter count: " . count($lettersResult['data']['letters']) . "\n\n";
          if (count($lettersResult['data']['letters']) > 0) {
            $firstLetter = $lettersResult['data']['letters'][0];
            $letterId = $firstLetter['id'];
            echo "Testing with letter ID: $letterId\n\n";
              // Test 3: Get Letter History
            echo "3. Testing Get Letter History\n";
            
            // Reset curl for GET request
            curl_reset($ch);
            curl_setopt($ch, CURLOPT_URL, $baseUrl . "/letters/$letterId/history");
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                'Content-Type: application/json',
                'Accept: application/json',
                'Authorization: Bearer ' . $token
            ]);
            
            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            echo "HTTP Status: $httpCode\n";
            echo "Response: $response\n\n";
              // Test 4: Approve Letter (Admin function)
            echo "4. Testing Letter Approval\n";
            $approvalData = json_encode([
                'description' => 'Approved for testing API'
            ]);
            
            // Reset curl for POST request
            curl_reset($ch);
            curl_setopt($ch, CURLOPT_URL, $baseUrl . "/letters/$letterId/approve");
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $approvalData);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                'Content-Type: application/json',
                'Accept: application/json',
                'Authorization: Bearer ' . $token
            ]);
            
            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            echo "HTTP Status: $httpCode\n";
            echo "Response: $response\n\n";
        }
    }
} else {
    echo "Login failed! Trying alternative credentials...\n\n";
    
    // Try different passwords
    $passwords = ['password', 'admin', 'admin123', '123456'];
    
    foreach ($passwords as $pwd) {
        echo "Trying password: $pwd\n";
        $loginData = json_encode([
            'login' => 'admin@cmlabs.com',
            'password' => $pwd
        ]);
        
        curl_setopt($ch, CURLOPT_URL, $baseUrl . '/login');
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $loginData);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'Accept: application/json'
        ]);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        echo "HTTP Status: $httpCode\n";
        
        if ($httpCode === 200) {
            echo "SUCCESS with password: $pwd\n";
            echo "Response: $response\n";
            break;
        } else {
            echo "Failed\n";
        }
        echo "\n";
    }
}

curl_close($ch);
echo "\n=== API Testing Complete ===\n";
