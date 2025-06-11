<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\CheckClockController;
use App\Http\Controllers\CheckClockSettingController;
use App\Http\Controllers\CheckClockSettingTimeController;
use App\Http\Controllers\LetterFormatController;
use App\Http\Controllers\LetterController;
use App\Http\Controllers\Api\PlanController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\SubscriptionController;
use App\Http\Controllers\Api\OrderController;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/login/google', [AuthController::class, 'loginWithGoogle']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

// Public Plans and Payment routes (no auth required for viewing)
Route::get('/plans', [PlanController::class, 'index']);
Route::get('/plans/{id}', [PlanController::class, 'show']);
Route::get('/payment-methods', [PaymentController::class, 'index']);
Route::post('/payment/calculate', [PaymentController::class, 'calculate']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::post('/change-password', [AuthController::class, 'changePassword']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/logout-all-devices', [AuthController::class, 'logoutFromAllDevices']);
    
    // Super admin only
    Route::middleware('super_admin')->group(function () {
        Route::post('/promote-user', [AuthController::class, 'promoteUser']);
        Route::post('/upgrade-to-super-admin', [AuthController::class, 'upgradeToSuperAdmin']);
    });
    
    // Employee routes (Admin/SuperAdmin only)
    Route::middleware('admin')->group(function () {
        Route::apiResource('employees', EmployeeController::class)->parameters([
            'employees' => 'nik'
        ]);
        Route::post('/employees/{nik}/avatar', [EmployeeController::class, 'uploadAvatar']);
        Route::get('/employees-export', [EmployeeController::class, 'export']);
        Route::post('employees/import', [EmployeeController::class, 'import']);
        Route::get('employees/template/download', [EmployeeController::class, 'downloadTemplate']);
    });
    
    // Check Clock routes (All authenticated users)
    Route::prefix('check-clock')->group(function () {
        Route::get('/', [CheckClockController::class, 'index']);
        Route::post('/clock-in', [CheckClockController::class, 'clockIn']);
        Route::post('/clock-out', [CheckClockController::class, 'clockOut']);
        Route::post('/break-start', [CheckClockController::class, 'breakStart']);
        Route::post('/break-end', [CheckClockController::class, 'breakEnd']);
        Route::get('/today-status', [CheckClockController::class, 'todayStatus']);
        
        // Admin only
        Route::middleware('admin')->get('/attendance-summary', [CheckClockController::class, 'attendanceSummary']);
    });
    
    // Check Clock Settings (Admin/SuperAdmin only)
    Route::middleware('admin')->apiResource('check-clock-settings', CheckClockSettingController::class);
    
    // Check Clock Setting Times (Admin/SuperAdmin only)
    Route::middleware('admin')->apiResource('check-clock-settings.times', CheckClockSettingTimeController::class);
    
    // Letter Format routes (Admin/SuperAdmin only)
    Route::middleware('admin')->group(function () {
        Route::apiResource('letter-formats', LetterFormatController::class);
        Route::post('/letter-formats/{id}/toggle-status', [LetterFormatController::class, 'toggleStatus']);
        Route::get('/letter-formats/{id}/download', [LetterFormatController::class, 'download']);
    });
    
    // Letter routes (All authenticated users can view, Admin can CRUD)
    Route::apiResource('letters', LetterController::class);
    Route::get('/letters/employee/{employeeName}', [LetterController::class, 'getByEmployee']);
    Route::post('/letters/generate-for-employee', [LetterController::class, 'generateForEmployee']);
    Route::get('/available-letter-formats', [LetterController::class, 'getAvailableFormats']);
    
    // Payment processing (requires auth)
    Route::post('/payment/process', [PaymentController::class, 'store']);
    Route::get('/payment/order/{orderId}', [PaymentController::class, 'show']);
    
    // User subscriptions
    Route::get('/subscriptions', [SubscriptionController::class, 'index']);
    Route::get('/subscriptions/{id}', [SubscriptionController::class, 'show']);
    Route::put('/subscriptions/{id}', [SubscriptionController::class, 'update']);
    Route::post('/subscriptions/{id}/cancel', [SubscriptionController::class, 'cancel']);
    
    // User orders
    Route::get('/orders', [OrderController::class, 'index']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);
    Route::get('/orders/statistics', [OrderController::class, 'statistics']);
    
    // Admin only - Plans management
    Route::middleware('admin')->group(function () {
        Route::post('/plans', [PlanController::class, 'store']);
        Route::put('/plans/{id}', [PlanController::class, 'update']);
        Route::delete('/plans/{id}', [PlanController::class, 'destroy']);
    });
});