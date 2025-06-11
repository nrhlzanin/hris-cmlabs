<?php
require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;

echo "=== USERS IN DATABASE ===\n";
$users = User::all(['id_users', 'name', 'email', 'role']);

if ($users->count() === 0) {
    echo "No users found in database!\n";
} else {
    foreach ($users as $user) {
        echo "ID: {$user->id_users} | Name: {$user->name} | Email: {$user->email} | Role: {$user->role}\n";
    }
}
