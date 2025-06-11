<?php
// Test script to login and test letter API endpoints

$baseUrl = 'http://127.0.0.1:8001';

// Login to get token
$loginData = [
    'email' => 'admin@cmlabs.com',
    'password' => 'password' // assuming default password
];

echo "=== Testing Login ===\n";
$loginResponse = callAPI('POST', $baseUrl . '/api/login', $loginData);
$loginResult = json_decode($loginResponse, true);

if (isset($loginResult['data']['token'])) {
    $token = $loginResult['data']['token'];
    echo "Login successful! Token: " . substr($token, 0, 20) . "...\n\n";
    
    // Test letters endpoint
    echo "=== Testing Letters Index ===\n";
    $lettersResponse = callAPI('GET', $baseUrl . '/api/letters', null, $token);
    $lettersResult = json_decode($lettersResponse, true);
    echo "Letters response:\n";
    echo json_encode($lettersResult, JSON_PRETTY_PRINT) . "\n\n";
    
    // If we have letters, test history endpoint
    if (isset($lettersResult['data']) && count($lettersResult['data']) > 0) {
        $letterId = $lettersResult['data'][0]['id'];
        echo "=== Testing Letter History (ID: $letterId) ===\n";
        $historyResponse = callAPI('GET', $baseUrl . "/api/letters/$letterId/history", null, $token);
        $historyResult = json_decode($historyResponse, true);
        echo "History response:\n";
        echo json_encode($historyResult, JSON_PRETTY_PRINT) . "\n\n";
        
        // Test approve endpoint
        echo "=== Testing Letter Approval (ID: $letterId) ===\n";
        $approvalData = ['description' => 'Approved by admin for testing'];
        $approveResponse = callAPI('POST', $baseUrl . "/api/letters/$letterId/approve", $approvalData, $token);
        $approveResult = json_decode($approveResponse, true);
        echo "Approval response:\n";
        echo json_encode($approveResult, JSON_PRETTY_PRINT) . "\n\n";
    }
    
} else {
    echo "Login failed! Response:\n";
    echo $loginResponse . "\n";
    
    // Try with different password
    echo "\n=== Trying with 'admin123' password ===\n";
    $loginData['password'] = 'admin123';
    $loginResponse2 = callAPI('POST', $baseUrl . '/api/login', $loginData);
    echo $loginResponse2 . "\n";
}

function callAPI($method, $url, $data = null, $token = null) {
    $curl = curl_init();
    
    $headers = ['Content-Type: application/json'];
    if ($token) {
        $headers[] = 'Authorization: Bearer ' . $token;
    }
    
    curl_setopt_array($curl, [
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CUSTOMREQUEST => $method,
        CURLOPT_HTTPHEADER => $headers,
        CURLOPT_TIMEOUT => 30,
    ]);
    
    if ($data) {
        curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($data));
    }
    
    $response = curl_exec($curl);
    $httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
    curl_close($curl);
    
    echo "HTTP $httpCode - ";
    return $response;
}
