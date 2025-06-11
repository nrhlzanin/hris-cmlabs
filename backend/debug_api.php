<?php
echo "=== DEBUG API RESPONSE ===\n\n";

$baseUrl = 'http://127.0.0.1:8001/api';

// Login first
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
$loginResult = json_decode($response, true);
$token = $loginResult['data']['token'];

// Get letters
curl_reset($ch);
curl_setopt($ch, CURLOPT_URL, $baseUrl . '/letters');
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Accept: application/json',
    'Authorization: Bearer ' . $token
]);

$response = curl_exec($ch);
$lettersResult = json_decode($response, true);

echo "Letters API Response Structure:\n";
echo "================================\n";
print_r($lettersResult);

curl_close($ch);
