<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\EmployeeController;
use App\Http\Controllers\Api\CheckClockController;
use App\Http\Controllers\Api\CheckClockSettingController;
use App\Http\Controllers\Api\CheckClockSettingTimeController;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/login/google', [AuthController::class, 'loginWithGoogle']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::post('/change-password', [AuthController::class, 'changePassword']);
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // Super admin only
    Route::post('/promote-user', [AuthController::class, 'promoteUser']);
    Route::post('/upgrade-to-super-admin', [AuthController::class, 'upgradeToSuperAdmin']);
    
    // Employee routes (Admin/SuperAdmin only)
    Route::apiResource('employees', EmployeeController::class)->parameters([
        'employees' => 'nik'
    ]);
    Route::post('/employees/{nik}/avatar', [EmployeeController::class, 'uploadAvatar']);
    Route::get('/employees-export', [EmployeeController::class, 'export']);
    
    // Check Clock routes (All authenticated users)
    Route::prefix('check-clock')->group(function () {
        Route::get('/', [CheckClockController::class, 'index']);
        Route::post('/clock-in', [CheckClockController::class, 'clockIn']);
        Route::post('/clock-out', [CheckClockController::class, 'clockOut']);
        Route::post('/break-start', [CheckClockController::class, 'breakStart']);
        Route::post('/break-end', [CheckClockController::class, 'breakEnd']);
        Route::get('/today-status', [CheckClockController::class, 'todayStatus']);
        
        // Admin only
        Route::get('/attendance-summary', [CheckClockController::class, 'attendanceSummary']);
    });
    
    // Check Clock Settings (Admin/SuperAdmin only)
    Route::apiResource('check-clock-settings', CheckClockSettingController::class);
    
    // Check Clock Setting Times (Admin/SuperAdmin only)
    Route::apiResource('check-clock-settings.times', CheckClockSettingTimeController::class);
});