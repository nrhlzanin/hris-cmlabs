<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\ChangePasswordRequest;
use App\Http\Requests\Auth\ForgotPasswordRequest;
use App\Http\Requests\Auth\ResetPasswordRequest;
use App\Services\AuthService;
use App\Models\User;
use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class AuthController extends Controller
{
    protected $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    /**
     * Register new user - creates both Employee and User records
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        try {
            $result = $this->authService->register($request->validated());

            return response()->json([
                'success' => true,
                'message' => 'Registration successful! Welcome to HRIS.',
                'data' => [
                    'user' => [
                        'id' => $result['user']->id_users,
                        'nik' => $result['user']->employee_id,
                        'name' => $result['user']->name,
                        'username' => $result['user']->username,
                        'email' => $result['user']->email,
                        'role' => $result['user']->role,
                    ],
                    'employee' => [
                        'nik' => $result['employee']->nik,
                        'first_name' => $result['employee']->first_name,
                        'last_name' => $result['employee']->last_name,
                        'position' => $result['employee']->position,
                        'branch' => $result['employee']->branch,
                    ],
                    'token' => $result['token'],
                    'token_type' => 'Bearer'
                ]
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Registration failed. Please try again.',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    /**
     * Login with multiple options: email, phone, username, or NIK
     */
    public function login(LoginRequest $request): JsonResponse
    {
        try {
            $result = $this->authService->login(
                $request->login,
                $request->password,
                $request->boolean('remember', false)
            );

            if (!$result['success']) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid credentials. Please check your email/phone/NIK and password.'
                ], 401);
            }

            $user = $result['user'];
            $profileData = $this->authService->getUserProfile($user);

            return response()->json([
                'success' => true,
                'message' => 'Login successful! Welcome back.',
                'data' => [
                    'user' => $profileData['user'],
                    'employee' => $profileData['employee'],
                    'token' => $result['token'],
                    'token_type' => 'Bearer'
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Login failed. Please try again.',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    /**
     * Send password reset link
     */
    public function forgotPassword(ForgotPasswordRequest $request): JsonResponse
    {
        try {
            $result = $this->authService->sendPasswordResetLink($request->email);

            if (!$result) {
                return response()->json([
                    'success' => false,
                    'message' => 'No account found with this email address.'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'message' => 'Password reset link has been sent to your email.'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to send password reset link. Please try again.',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    /**
     * Reset password with token
     */
    public function resetPassword(ResetPasswordRequest $request): JsonResponse
    {
        try {
            $result = $this->authService->resetPassword(
                $request->email,
                $request->token,
                $request->password
            );

            if (!$result) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid or expired reset token.'
                ], 400);
            }

            return response()->json([
                'success' => true,
                'message' => 'Password has been reset successfully. You can now login with your new password.'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to reset password. Please try again.',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    /**
     * Login with Google (placeholder for Google OAuth)
     */
    public function loginWithGoogle(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'google_token' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Google token is required',
                'errors' => $validator->errors()
            ], 422);
        }

        // TODO: Implement Google OAuth verification
        // For now, return placeholder response
        return response()->json([
            'success' => false,
            'message' => 'Google login will be available soon. Please use email login for now.'
        ], 501);
    }

    /**
     * Get user profile
     */
    public function profile(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            $profileData = $this->authService->getUserProfile($user);

            return response()->json([
                'success' => true,
                'message' => 'Profile retrieved successfully',
                'data' => $profileData
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve profile.',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    /**
     * Promote user to admin (only superadmin can do this)
     */
    public function promoteUser(Request $request): JsonResponse
    {
        $currentUser = $request->user();

        if (!$currentUser->isSuperAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Only super admin can promote users'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id_users',
            'role' => 'required|in:user,admin',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::where('id_users', $request->user_id)->first();
        $user->update(['role' => $request->role]);

        return response()->json([
            'success' => true,
            'message' => "User promoted to {$request->role} successfully",
            'data' => [
                'user' => [
                    'id' => $user->id_users,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                ]
            ]
        ], 200);
    }

    /**
     * Upgrade to super admin (when purchasing plans/seats)
     */
    public function upgradeToSuperAdmin(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'plan_id' => 'required|string',
            'payment_token' => 'required|string',
            // Add other payment-related fields
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // TODO: Implement payment verification logic
        // For now, just upgrade the user
        $user = $request->user();
        $user->update(['role' => 'super_admin']);

        return response()->json([
            'success' => true,
            'message' => 'Upgraded to Super Admin successfully',
            'data' => [
                'user' => [
                    'id' => $user->id_users,
                    'name' => $user->name,
                    'role' => $user->role,
                ]
            ]
        ], 200);
    }

    /**
     * Change password
     */
    public function changePassword(ChangePasswordRequest $request): JsonResponse
    {
        try {
            $user = $request->user();
            $result = $this->authService->changePassword(
                $user,
                $request->current_password,
                $request->password
            );

            if (!$result) {
                return response()->json([
                    'success' => false,
                    'message' => 'Current password is incorrect.'
                ], 400);
            }

            return response()->json([
                'success' => true,
                'message' => 'Password changed successfully.'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to change password. Please try again.',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    /**
     * Logout
     */
    public function logout(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            $this->authService->logout($user);

            return response()->json([
                'success' => true,
                'message' => 'Logged out successfully. See you next time!'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to logout.',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    /**
     * Refresh token - create a new token for the authenticated user
     */
    public function refreshToken(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            
            // Create a new token for the user
            $token = $user->createToken('auth_token')->plainTextToken;
            
            // Get updated profile data
            $profileData = $this->authService->getUserProfile($user);

            return response()->json([
                'success' => true,
                'message' => 'Token refreshed successfully.',
                'data' => [
                    'user' => $profileData['user'],
                    'employee' => $profileData['employee'],
                    'token' => $token,
                    'token_type' => 'Bearer'
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to refresh token.',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    /**
     * Logout from all devices
     */
    public function logoutFromAllDevices(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            $this->authService->logoutFromAllDevices($user);

            return response()->json([
                'success' => true,
                'message' => 'Logged out from all devices successfully.'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to logout from all devices.',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }
}