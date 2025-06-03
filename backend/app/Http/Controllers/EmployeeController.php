<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\LetterFormat;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class EmployeeController extends Controller
{
    /**
     * Get all employees with pagination and filters
     */
    public function index(Request $request): JsonResponse
    {
        $query = Employee::with('letterFormat');

        // Search functionality
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', '%' . $search . '%')
                  ->orWhere('last_name', 'like', '%' . $search . '%')
                  ->orWhere('nik', 'like', '%' . $search . '%')
                  ->orWhere('mobile_phone', 'like', '%' . $search . '%')
                  ->orWhere('position', 'like', '%' . $search . '%')
                  ->orWhere('branch', 'like', '%' . $search . '%');
            });
        }

        // Filter by gender
        if ($request->has('gender') && $request->gender) {
            $query->where('gender', $request->gender);
        }

        // Filter by branch
        if ($request->has('branch') && $request->branch) {
            $query->where('branch', $request->branch);
        }

        // Filter by position
        if ($request->has('position') && $request->position) {
            $query->where('position', $request->position);
        }

        // Filter by contract type
        if ($request->has('contract_type') && $request->contract_type) {
            $query->where('contract_type', $request->contract_type);
        }

        // Pagination
        $perPage = $request->get('per_page', 10);
        $employees = $query->paginate($perPage);

        // Get statistics
        $stats = $this->getEmployeeStats();

        return response()->json([
            'success' => true,
            'message' => 'Employees retrieved successfully',
            'data' => [
                'employees' => $employees->items(),
                'pagination' => [
                    'current_page' => $employees->currentPage(),
                    'last_page' => $employees->lastPage(),
                    'per_page' => $employees->perPage(),
                    'total' => $employees->total(),
                    'from' => $employees->firstItem(),
                    'to' => $employees->lastItem(),
                ],
                'statistics' => $stats
            ]
        ], 200);
    }

    /**
     * Store a new employee
     */
    public function store(Request $request): JsonResponse
    {
        // Check if user is admin or super admin
        if (!$request->user()->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Only admin or super admin can create employees'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'nik' => 'required|string|unique:employees,nik',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'mobile_phone' => 'required|string|max:20',
            'gender' => 'required|in:Men,Woman',
            'last_education' => 'required|in:high_school,SMA,SMK_Sederajat,bachelor,S1,master,S2',
            'place_of_birth' => 'required|string|max:255',
            'date_of_birth' => 'required|date|before:today',
            'position' => 'required|string|max:255',
            'branch' => 'required|string|max:255',
            'contract_type' => 'required|in:Permanent,Contract',
            'grade' => 'required|string|max:100',
            'bank' => 'required|in:BCA,BNI,BRI,BSI,BTN,CMIB,Mandiri,Permata',
            'account_number' => 'required|string|max:50',
            'acc_holder_name' => 'required|string|max:255',
            'letter_id' => 'nullable|exists:letter_formats,id_letter',
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $employeeData = $request->except(['avatar']);

            // Handle avatar upload
            if ($request->hasFile('avatar')) {
                $avatarPath = $request->file('avatar')->store('avatars', 'public');
                $employeeData['avatar'] = $avatarPath;
            }

            $employee = Employee::create($employeeData);

            return response()->json([
                'success' => true,
                'message' => 'Employee created successfully',
                'data' => [
                    'employee' => [
                        'nik' => $employee->nik,
                        'full_name' => $employee->full_name,
                        'first_name' => $employee->first_name,
                        'last_name' => $employee->last_name,
                        'mobile_phone' => $employee->mobile_phone,
                        'gender' => $employee->gender,
                        'position' => $employee->position,
                        'branch' => $employee->branch,
                        'contract_type' => $employee->contract_type,
                        'grade' => $employee->grade,
                        'avatar_url' => $employee->avatar_url,
                    ]
                ]
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create employee',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Show specific employee
     */
    public function show(string $nik): JsonResponse
    {
        $employee = Employee::with(['letterFormat', 'user'])->where('nik', $nik)->first();

        if (!$employee) {
            return response()->json([
                'success' => false,
                'message' => 'Employee not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Employee retrieved successfully',
            'data' => [
                'employee' => [
                    'nik' => $employee->nik,
                    'avatar_url' => $employee->avatar_url,
                    'first_name' => $employee->first_name,
                    'last_name' => $employee->last_name,
                    'full_name' => $employee->full_name,
                    'mobile_phone' => $employee->mobile_phone,
                    'gender' => $employee->gender,
                    'last_education' => $employee->last_education,
                    'place_of_birth' => $employee->place_of_birth,
                    'date_of_birth' => $employee->date_of_birth->format('Y-m-d'),
                    'age' => $employee->age,
                    'position' => $employee->position,
                    'branch' => $employee->branch,
                    'contract_type' => $employee->contract_type,
                    'grade' => $employee->grade,
                    'bank' => $employee->bank,
                    'account_number' => $employee->account_number,
                    'acc_holder_name' => $employee->acc_holder_name,
                    'letter_format' => $employee->letterFormat ? [
                        'id' => $employee->letterFormat->id_letter,
                        'name' => $employee->letterFormat->name_letter,
                    ] : null,
                    'user_account' => $employee->user ? [
                        'id' => $employee->user->id_users,
                        'email' => $employee->user->email,
                        'role' => $employee->user->role,
                    ] : null,
                    'created_at' => $employee->created_at,
                    'updated_at' => $employee->updated_at,
                ]
            ]
        ], 200);
    }

    /**
     * Update employee
     */
    public function update(Request $request, string $nik): JsonResponse
    {
        // Check if user is admin or super admin
        if (!$request->user()->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Only admin or super admin can update employees'
            ], 403);
        }

        $employee = Employee::where('nik', $nik)->first();

        if (!$employee) {
            return response()->json([
                'success' => false,
                'message' => 'Employee not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'nik' => ['sometimes', 'string', Rule::unique('employees')->ignore($employee->nik, 'nik')],
            'first_name' => 'sometimes|string|max:255',
            'last_name' => 'sometimes|string|max:255',
            'mobile_phone' => 'sometimes|string|max:20',
            'gender' => 'sometimes|in:Men,Woman',
            'last_education' => 'sometimes|in:high_school,SMA,SMK_Sederajat,bachelor,S1,master,S2',
            'place_of_birth' => 'sometimes|string|max:255',
            'date_of_birth' => 'sometimes|date|before:today',
            'position' => 'sometimes|string|max:255',
            'branch' => 'sometimes|string|max:255',
            'contract_type' => 'sometimes|in:Permanent,Contract',
            'grade' => 'sometimes|string|max:100',
            'bank' => 'sometimes|in:BCA,BNI,BRI,BSI,BTN,CMIB,Mandiri,Permata',
            'account_number' => 'sometimes|string|max:50',
            'acc_holder_name' => 'sometimes|string|max:255',
            'letter_id' => 'nullable|exists:letter_formats,id_letter',
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $employeeData = $request->except(['avatar']);

            // Handle avatar upload
            if ($request->hasFile('avatar')) {
                // Delete old avatar if exists
                if ($employee->avatar) {
                    Storage::disk('public')->delete($employee->avatar);
                }
                
                $avatarPath = $request->file('avatar')->store('avatars', 'public');
                $employeeData['avatar'] = $avatarPath;
            }

            $employee->update($employeeData);

            // Update related user data if names changed
            if ($employee->user && ($request->has('first_name') || $request->has('last_name'))) {
                $employee->user->update([
                    'name' => $employee->full_name,
                    'mobile_phone' => $employee->mobile_phone
                ]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Employee updated successfully',
                'data' => [
                    'employee' => [
                        'nik' => $employee->nik,
                        'full_name' => $employee->full_name,
                        'first_name' => $employee->first_name,
                        'last_name' => $employee->last_name,
                        'mobile_phone' => $employee->mobile_phone,
                        'gender' => $employee->gender,
                        'position' => $employee->position,
                        'branch' => $employee->branch,
                        'contract_type' => $employee->contract_type,
                        'grade' => $employee->grade,
                        'avatar_url' => $employee->avatar_url,
                    ]
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update employee',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete employee
     */
    public function destroy(Request $request, string $nik): JsonResponse
    {
        // Check if user is super admin
        if (!$request->user()->isSuperAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Only super admin can delete employees'
            ], 403);
        }

        $employee = Employee::where('nik', $nik)->first();

        if (!$employee) {
            return response()->json([
                'success' => false,
                'message' => 'Employee not found'
            ], 404);
        }

        try {
            // Delete avatar if exists
            if ($employee->avatar) {
                Storage::disk('public')->delete($employee->avatar);
            }

            $employee->delete();

            return response()->json([
                'success' => true,
                'message' => 'Employee deleted successfully'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete employee',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Upload/Update employee avatar
     */
    public function uploadAvatar(Request $request, string $nik): JsonResponse
    {
        $employee = Employee::where('nik', $nik)->first();

        if (!$employee) {
            return response()->json([
                'success' => false,
                'message' => 'Employee not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'avatar' => 'required|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Delete old avatar if exists
            if ($employee->avatar) {
                Storage::disk('public')->delete($employee->avatar);
            }

            // Store new avatar
            $avatarPath = $request->file('avatar')->store('avatars', 'public');
            $employee->update(['avatar' => $avatarPath]);

            return response()->json([
                'success' => true,
                'message' => 'Avatar uploaded successfully',
                'data' => [
                    'avatar_url' => $employee->avatar_url
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to upload avatar',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Export employees data
     */
    public function export(Request $request): JsonResponse
    {
        // Check if user is admin or super admin
        if (!$request->user()->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Only admin or super admin can export employees'
            ], 403);
        }

        try {
            $employees = Employee::all();

            // Convert to array for export
            $exportData = $employees->map(function ($employee) {
                return [
                    'NIK' => $employee->nik,
                    'First Name' => $employee->first_name,
                    'Last Name' => $employee->last_name,
                    'Mobile Phone' => $employee->mobile_phone,
                    'Gender' => $employee->gender,
                    'Last Education' => $employee->last_education,
                    'Place of Birth' => $employee->place_of_birth,
                    'Date of Birth' => $employee->date_of_birth->format('Y-m-d'),
                    'Position' => $employee->position,
                    'Branch' => $employee->branch,
                    'Contract Type' => $employee->contract_type,
                    'Grade' => $employee->grade,
                    'Bank' => $employee->bank,
                    'Account Number' => $employee->account_number,
                    'Account Holder Name' => $employee->acc_holder_name,
                ];
            });

            return response()->json([
                'success' => true,
                'message' => 'Employees exported successfully',
                'data' => $exportData
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to export employees',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get employee statistics
     */
    private function getEmployeeStats(): array
    {
        return [
            'total_employees' => Employee::count(),
            'total_new_hire' => Employee::whereMonth('created_at', now()->month)
                                     ->whereYear('created_at', now()->year)
                                     ->count(),
            'full_time_employees' => Employee::where('contract_type', 'Permanent')->count(),
            'contract_employees' => Employee::where('contract_type', 'Contract')->count(),
            'by_gender' => [
                'men' => Employee::where('gender', 'Men')->count(),
                'women' => Employee::where('gender', 'Woman')->count(),
            ],
            'by_branch' => Employee::select('branch')
                                 ->selectRaw('count(*) as total')
                                 ->groupBy('branch')
                                 ->get()
                                 ->pluck('total', 'branch'),
        ];
    }
}