<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\EmployeeController;

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
    
    // Additional employee routes
    Route::post('/employees/{nik}/avatar', [EmployeeController::class, 'uploadAvatar']);
    Route::get('/employees-export', [EmployeeController::class, 'export']);
});
