<?php

namespace App\Services;

use App\Models\User;
use App\Models\Employee;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Carbon\Carbon;

class AuthService
{
    /**
     * Register a new user with employee record
     */
    public function register(array $data): array
    {
        DB::beginTransaction();
        
        try {
            // Generate unique NIK
            $nik = $this->generateNIK();            // Create Employee record
            $employee = Employee::create([
                'nik' => $nik,
                'first_name' => $data['first_name'],
                'last_name' => $data['last_name'],
                'mobile_phone' => $data['mobile_phone'] ?? '+62', // Default phone format
                'gender' => 'Men', // Default
                'last_education' => 'S1', // Valid enum value
                'place_of_birth' => 'Jakarta', // Default location
                'date_of_birth' => now()->subYears(25), // Default
                'position' => 'Employee', // Default
                'branch' => 'Main Office', // Default
                'contract_type' => 'Permanent', // Default
                'grade' => 'Junior', // Default
                'bank' => 'BCA', // Default
                'account_number' => '', // Will be updated later
                'acc_holder_name' => $data['first_name'] . ' ' . $data['last_name'],
            ]);

            // Generate username
            $username = $this->generateUsername($data['first_name'], $data['last_name'], $nik);            // Create User record
            $user = User::create([
                'employee_id' => $nik,
                'role' => 'user', // Default role
                'name' => $data['first_name'] . ' ' . $data['last_name'],
                'mobile_phone' => $data['mobile_phone'] ?? '+62',
                'username' => $username,
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
            ]);

            // Generate token
            $token = $user->createToken('auth_token')->plainTextToken;

            DB::commit();

            return [
                'success' => true,
                'user' => $user,
                'employee' => $employee,
                'token' => $token,
            ];

        } catch (\Exception $e) {
            DB::rollback();
            throw $e;
        }
    }

    /**
     * Authenticate user with multiple login options
     */
    public function login(string $login, string $password, bool $remember = false): array
    {
        $user = $this->findUserByLogin($login);

        if (!$user || !Hash::check($password, $user->password)) {
            return [
                'success' => false,
                'message' => 'Invalid credentials'
            ];
        }

        // Update last login
        $user->update(['last_login_at' => now()]);

        // Create token with expiration based on remember option
        $tokenName = 'auth_token';
        if ($remember) {
            $token = $user->createToken($tokenName, ['*'], now()->addDays(30))->plainTextToken;
        } else {
            $token = $user->createToken($tokenName, ['*'], now()->addHours(24))->plainTextToken;
        }

        return [
            'success' => true,
            'user' => $user,
            'token' => $token,
        ];
    }

    /**
     * Find user by login (email, phone, or NIK)
     */
    public function findUserByLogin(string $login): ?User
    {
        // Try to find by email first
        if (filter_var($login, FILTER_VALIDATE_EMAIL)) {
            return User::where('email', $login)->first();
        }

        // Try to find by username
        $userByUsername = User::where('username', $login)->first();
        if ($userByUsername) {
            return $userByUsername;
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
     * Change user password
     */
    public function changePassword(User $user, string $currentPassword, string $newPassword): bool
    {
        if (!Hash::check($currentPassword, $user->password)) {
            return false;
        }

        $user->update([
            'password' => Hash::make($newPassword),
            'password_changed_at' => now(),
        ]);

        return true;
    }

    /**
     * Send password reset link
     */
    public function sendPasswordResetLink(string $email): bool
    {
        $user = User::where('email', $email)->first();
        
        if (!$user) {
            return false;
        }

        $token = Str::random(64);
        
        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $email],
            [
                'token' => Hash::make($token),
                'created_at' => now()
            ]
        );

        // TODO: Send email with reset link
        // Mail::send('emails.password-reset', ['token' => $token], function($message) use ($email) {
        //     $message->to($email);
        //     $message->subject('Reset Password');
        // });

        return true;
    }

    /**
     * Reset password with token
     */
    public function resetPassword(string $email, string $token, string $password): bool
    {
        $resetRecord = DB::table('password_reset_tokens')
            ->where('email', $email)
            ->first();

        if (!$resetRecord || !Hash::check($token, $resetRecord->token)) {
            return false;
        }

        // Check if token is expired (24 hours)
        if (Carbon::parse($resetRecord->created_at)->addHours(24)->isPast()) {
            DB::table('password_reset_tokens')->where('email', $email)->delete();
            return false;
        }

        $user = User::where('email', $email)->first();
        if (!$user) {
            return false;
        }

        $user->update([
            'password' => Hash::make($password),
            'password_changed_at' => now(),
        ]);

        // Delete the reset token
        DB::table('password_reset_tokens')->where('email', $email)->delete();

        return true;
    }

    /**
     * Logout user (revoke current token)
     */
    public function logout(User $user): bool
    {
        $user->currentAccessToken()->delete();
        return true;
    }

    /**
     * Logout from all devices (revoke all tokens)
     */
    public function logoutFromAllDevices(User $user): bool
    {
        $user->tokens()->delete();
        return true;
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

    /**
     * Generate unique username
     */
    private function generateUsername(string $firstName, string $lastName, string $nik): string
    {
        $baseUsername = strtolower($firstName . '.' . $lastName);
        $username = $baseUsername;
        $counter = 1;

        while (User::where('username', $username)->exists()) {
            $username = $baseUsername . '.' . $counter;
            $counter++;
        }

        return $username;
    }

    /**
     * Get user profile with employee data
     */
    public function getUserProfile(User $user): array
    {
        $user->load('employee');

        return [
            'user' => [
                'id' => $user->id_users,
                'nik' => $user->employee_id,
                'name' => $user->name,
                'username' => $user->username,
                'email' => $user->email,
                'role' => $user->role,
                'mobile_phone' => $user->mobile_phone,
                'last_login_at' => $user->last_login_at,
                'email_verified_at' => $user->email_verified_at,
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
                'grade' => $user->employee->grade,
                'avatar_url' => $user->employee->avatar_url,
                'mobile_phone' => $user->employee->mobile_phone,
                'date_of_birth' => $user->employee->date_of_birth,
                'place_of_birth' => $user->employee->place_of_birth,
            ] : null
        ];
    }
}
