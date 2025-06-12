<?php
require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;

echo "Users in database:\n";
foreach (User::all() as $user) {
    echo "ID: {$user->id_users}, Email: {$user->email}, Role: {$user->role}\n";
}
