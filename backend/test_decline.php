<?php
echo "=== Testing Letter Decline Functionality ===\n\n";

$baseUrl = 'http://127.0.0.1:8001/api';

// Login as admin
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
echo "Login HTTP Status: $httpCode\n";
echo "Login Response: $response\n\n";

$loginResult = json_decode($response, true);

if (!$loginResult || !isset($loginResult['data']['token'])) {
    echo "Login failed! Exiting...\n";
    exit(1);
}

$token = $loginResult['data']['token'];

echo "Logged in successfully!\n\n";

// Test declining a letter that can be declined (status: waiting_reviewed)
// Letter ID 4 has status "waiting_reviewed"
$letterId = 4;

echo "Testing decline for letter ID: $letterId\n";
$declineData = json_encode([
    'description' => 'Insufficient documentation provided for sick leave'
]);

curl_reset($ch);
curl_setopt($ch, CURLOPT_URL, $baseUrl . "/letters/$letterId/decline");
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
echo "HTTP Status: $httpCode\n";
echo "Response: $response\n\n";

// Check updated history
echo "Checking updated history...\n";
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

curl_close($ch);
echo "=== Test Complete ===\n";
