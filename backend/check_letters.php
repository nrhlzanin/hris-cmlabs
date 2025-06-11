<?php
require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Letter;

echo "Letters in database:\n";
foreach (Letter::all() as $letter) {
    echo "ID: {$letter->id}, Status: {$letter->status}, Type: {$letter->letter_type}\n";
}
