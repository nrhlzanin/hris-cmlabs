<?php
require_once 'vendor/autoload.php';

use Illuminate\Database\Capsule\Manager as Capsule;

$capsule = new Capsule;

$capsule->addConnection([
    'driver' => 'pgsql',
    'host' => '127.0.0.1',
    'database' => 'hris_db',
    'username' => 'postgres',
    'password' => '',
    'charset' => 'utf8',
    'prefix' => '',
    'schema' => 'public',
]);

$capsule->setAsGlobal();
$capsule->bootEloquent();

// Update admin password
$result = $capsule->table('users')
    ->where('email', 'admin@cmlabs.com')
    ->update(['password' => password_hash('admin123', PASSWORD_DEFAULT)]);

echo "Password updated for admin@cmlabs.com: " . ($result ? 'SUCCESS' : 'FAILED') . "\n";

// Also update other users
$capsule->table('users')
    ->where('email', 'test@test.com')
    ->update(['password' => password_hash('test123', PASSWORD_DEFAULT)]);

$capsule->table('users')
    ->where('email', 'user1test@gmail.com')
    ->update(['password' => password_hash('user123', PASSWORD_DEFAULT)]);

echo "Updated passwords:\n";
echo "admin@cmlabs.com: admin123\n";
echo "test@test.com: test123\n";
echo "user1test@gmail.com: user123\n";
