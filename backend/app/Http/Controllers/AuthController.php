<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
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
    /**
     * Register new user - creates both Employee and User records
     */
    public function register(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        DB::beginTransaction();
        
        try {
            // Generate unique NIK
            $nik = $this->generateNIK();

            // Create Employee record
            $employee = Employee::create([
                'nik' => $nik,
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'mobile_phone' => '', // Will be updated by admin later
                'gender' => 'Men', // Default
                'last_education' => 'bachelor', // Default
                'place_of_birth' => '', // Will be updated later
                'date_of_birth' => now()->subYears(25), // Default
                'position' => 'Employee', // Default
                'branch' => 'Main Office', // Default
                'contract_type' => 'Permanent', // Default
                'grade' => 'Junior', // Default
                'bank' => 'BCA', // Default
                'account_number' => '', // Will be updated later
                'acc_holder_name' => $request->first_name . ' ' . $request->last_name,
            ]);

            // Create User record
            $user = User::create([
                'employee_id' => $nik,
                'role' => 'user', // Default role, can be promoted by superadmin
                'name' => $request->first_name . ' ' . $request->last_name,
                'mobile_phone' => '', // Will be synced from employee when admin updates
                'username' => strtolower($request->first_name . '.' . $request->last_name . '.' . substr($nik, -4)),
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);

            $token = $user->createToken('auth_token')->plainTextToken;

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Registration successful',
                'data' => [
                    'user' => [
                        'id' => $user->id_users,
                        'nik' => $user->employee_id,
                        'name' => $user->name,
                        'username' => $user->username,
                        'email' => $user->email,
                        'role' => $user->role,
                    ],
                    'token' => $token,
                    'token_type' => 'Bearer'
                ]
            ], 201);

        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'success' => false,
                'message' => 'Registration failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Login with multiple options: email, phone, or NIK
     */
    public function login(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'login' => 'required|string', // Can be email, phone, or NIK
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = $this->findUserByLogin($request->login);

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid credentials'
            ], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'data' => [
                'user' => [
                    'id' => $user->id_users,
                    'nik' => $user->employee_id,
                    'name' => $user->name,
                    'username' => $user->username,
                    'email' => $user->email,
                    'role' => $user->role,
                    'mobile_phone' => $user->mobile_phone,
                    'employee' => $user->employee ? [
                        'first_name' => $user->employee->first_name,
                        'last_name' => $user->employee->last_name,
                        'position' => $user->employee->position,
                        'branch' => $user->employee->branch,
                        'avatar_url' => $user->employee->avatar_url,
                    ] : null
                ],
                'token' => $token,
                'token_type' => 'Bearer'
            ]
        ], 200);
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
            'message' => 'Google login not implemented yet'
        ], 501);
    }

    /**
     * Get user profile
     */
    public function profile(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'success' => true,
            'message' => 'Profile retrieved successfully',
            'data' => [
                'user' => [
                    'id' => $user->id_users,
                    'nik' => $user->employee_id,
                    'name' => $user->name,
                    'username' => $user->username,
                    'email' => $user->email,
                    'role' => $user->role,
                    'mobile_phone' => $user->mobile_phone,
                ],
                'employee' => $user->employee ? [
                    'nik' => $user->employee->nik,
                    'first_name' => $user->employee->first_name,
                    'last_name' => $user->employee->last_name,
                    'full_name' => $user->employee->full_name,
                    'gender' => $user->employee->gender,
                    'position' => $user->employee->position,
                    'branch' => $user->employee->branch,
                    'contract_type' => $user->employee->contract_type,
                    'avatar_url' => $user->employee->avatar_url,
                ] : null
            ]
        ], 200);
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
    public function changePassword(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'current_password' => 'required|string',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = $request->user();

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Current password is incorrect'
            ], 400);
        }

        $user->update(['password' => Hash::make($request->password)]);

        return response()->json([
            'success' => true,
            'message' => 'Password changed successfully'
        ], 200);
    }

    /**
     * Logout
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully'
        ], 200);
    }

    /**
     * Find user by login (email, phone, or NIK)
     */
    private function findUserByLogin(string $login): ?User
    {
        // Try to find by email first
        if (filter_var($login, FILTER_VALIDATE_EMAIL)) {
            return User::where('email', $login)->first();
        }

        // Try to find by phone (from employee table)
        $employeeByPhone = Employee::where('mobile_phone', $login)->first();
        if ($employeeByPhone) {
            return User::where('employee_id', $employeeByPhone->nik)->first();
        }

        // Try to find by NIK (employee_id)
        return User::where('employee_id', $login)->first();
    }

    /**
     * Generate unique NIK
     */
    private function generateNIK(): string
    {
        do {
            $nik = 'EMP' . date('Y') . str_pad(random_int(1, 9999), 4, '0', STR_PAD_LEFT);
        } while (Employee::where('nik', $nik)->exists());

        return $nik;
    }
}