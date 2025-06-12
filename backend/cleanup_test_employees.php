<?php
require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Employee;

echo "Cleaning up test employees...\n";

// Delete test employees with NIK pattern 1234567890123xxx
$testEmployees = Employee::where('nik', 'like', '1234567890123%')->get();

foreach ($testEmployees as $employee) {
    if ($employee->nik !== '1234567890123456' && $employee->nik !== '1234567890123457' && $employee->nik !== '1234567890123458') {
        echo "Deleting test employee: {$employee->nik} - {$employee->full_name}\n";
        if ($employee->avatar) {
            \Illuminate\Support\Facades\Storage::disk('public')->delete($employee->avatar);
        }
        $employee->delete();
    }
}

echo "Cleanup complete!\n";
