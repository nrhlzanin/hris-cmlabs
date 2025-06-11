<?php

require_once 'vendor/autoload.php';

// Load Laravel application
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;

// Update the existing user's password
$user = User::where('email', 'user1test@gmail.com')->first();
if ($user) {
    $user->password = Hash::make('password123');
    $user->save();
    echo "Password updated for user: {$user->name} - {$user->email}\n";
} else {
    echo "User not found\n";
}

echo "\nAll users in database:\n";
$users = User::all();

foreach ($users as $u) {
    echo $u->id_users . ' - ' . $u->name . ' - ' . $u->email . ' - ' . $u->role . "\n";
}
