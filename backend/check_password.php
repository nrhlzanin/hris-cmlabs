<?php
require 'vendor/autoload.php';
$app = require 'bootstrap/app.php';
$app->boot();

use App\Models\User;
use Illuminate\Support\Facades\Hash;

$user = User::where('email', 'admin@cmlabs.com')->first();
echo "User: " . $user->email . PHP_EOL;
echo "Password check (password): " . (Hash::check('password', $user->password) ? 'YES' : 'NO') . PHP_EOL;
echo "Password check (password123): " . (Hash::check('password123', $user->password) ? 'YES' : 'NO') . PHP_EOL;
echo "Password check (admin123): " . (Hash::check('admin123', $user->password) ? 'YES' : 'NO') . PHP_EOL;
echo "Password check (admin): " . (Hash::check('admin', $user->password) ? 'YES' : 'NO') . PHP_EOL;
