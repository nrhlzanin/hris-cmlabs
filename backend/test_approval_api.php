<?php

$baseUrl = 'http://localhost:8000';

echo "=== Testing Approval API with Real Record IDs ===\n\n";

// Step 1: Login as admin
echo "1. Logging in as admin...\n";
$loginData = json_encode([
    'login' => 'admin@hris.com',
    'password' => 'Admin123#'
]);

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $baseUrl . '/api/login');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $loginData);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Accept: application/json'
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
echo "Login HTTP Status: $httpCode\n";

$loginResult = json_decode($response, true);
if (!$loginResult || !isset($loginResult['data']['token'])) {
    echo "Login failed! Response: $response\n";
    exit(1);
}

$token = $loginResult['data']['token'];
echo "Login successful! Token: " . substr($token, 0, 20) . "...\n\n";

// Step 2: Test approval with real record ID
echo "2. Testing approval with record ID 1...\n";
$approvalData = json_encode([
    'admin_notes' => 'Approved via direct API test'
]);

curl_reset($ch);
curl_setopt($ch, CURLOPT_URL, $baseUrl . '/api/check-clock/1/approve');
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
echo "Approval HTTP Status: $httpCode\n";
echo "Approval Response: $response\n\n";

// Step 3: Test decline with record ID 2
echo "3. Testing decline with record ID 2...\n";
$declineData = json_encode([
    'admin_notes' => 'Declined via direct API test - insufficient information'
]);

curl_reset($ch);
curl_setopt($ch, CURLOPT_URL, $baseUrl . '/api/check-clock/2/decline');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $declineData);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Accept: application/json',
    'Authorization: Bearer ' . $token
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
echo "Decline HTTP Status: $httpCode\n";
echo "Decline Response: $response\n\n";

curl_close($ch);

echo "Test completed!\n";
