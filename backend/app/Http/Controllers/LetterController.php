<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Letter;
use App\Models\LetterFormat;
use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class LetterController extends Controller
{
    /**
     * Get all letters with pagination and filters
     */
    public function index(Request $request): JsonResponse
    {
        $query = Letter::with(['letterFormat', 'histories']);

        // Search by name or employee name
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%')
                  ->orWhere('employee_name', 'like', '%' . $search . '%');
            });
        }

        // Filter by letter format
        if ($request->has('letter_format_id') && $request->letter_format_id) {
            $query->byLetterFormat($request->letter_format_id);
        }

        // Filter by employee name
        if ($request->has('employee_name') && $request->employee_name) {
            $query->byEmployeeName($request->employee_name);
        }

        // Filter by status
        if ($request->has('status') && $request->status) {
            $query->byStatus($request->status);
        }

        // Filter by letter type
        if ($request->has('letter_type') && $request->letter_type) {
            $query->byLetterType($request->letter_type);
        }

        $perPage = $request->get('per_page', 10);
        $letters = $query->orderBy('created_at', 'desc')->paginate($perPage);

        $formattedLetters = $letters->items();
        foreach ($formattedLetters as $letter) {
            $letter->letterName = $letter->letter_format_name ?? $letter->name;
            $letter->letterType = $letter->letter_type;
            $letter->validUntil = $letter->formatted_valid_until;
            $letter->history = $letter->histories->map(function ($history) {
                return [
                    'date' => $history->formatted_date,
                    'status' => $history->status,
                    'description' => $history->description ?? '',
                    'actor' => $history->actor ?? 'System',
                ];
            })->toArray();
        }

        return response()->json([
            'success' => true,
            'message' => 'Letters retrieved successfully',
            'data' => [
                'letters' => $formattedLetters,
                'pagination' => [
                    'current_page' => $letters->currentPage(),
                    'last_page' => $letters->lastPage(),
                    'per_page' => $letters->perPage(),
                    'total' => $letters->total(),
                    'from' => $letters->firstItem(),
                    'to' => $letters->lastItem(),
                ]
            ]
        ], 200);
    }

    /**
     * Store new letter
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name_letter_id' => 'required|exists:letter_formats,id_letter',
            'employee_name' => 'required|string|max:255',
            'name' => 'required|string|max:255',
            'letter_type' => 'required|string|max:255',
            'status' => 'sometimes|in:pending,approved,declined,waiting_reviewed',
            'valid_until' => 'nullable|date|after:today',
            'description' => 'nullable|string',
            'supporting_document' => 'nullable|file|mimes:pdf,doc,docx,jpg,jpeg,png|max:5120',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Verify that the letter format is active
        $letterFormat = LetterFormat::where('id_letter', $request->name_letter_id)->first();
        
        if (!$letterFormat->isActive()) {
            return response()->json([
                'success' => false,
                'message' => 'Selected letter format is not active'
            ], 400);
        }

        try {
            $letterData = [
                'name_letter_id' => $request->name_letter_id,
                'employee_name' => $request->employee_name,
                'name' => $request->name,
                'letter_type' => $request->letter_type,
                'status' => $request->status ?? 'pending',
                'valid_until' => $request->valid_until,
                'description' => $request->description,
            ];

            // Handle file upload
            if ($request->hasFile('supporting_document')) {
                $file = $request->file('supporting_document');
                $path = $file->store('letters', 'public');
                $letterData['supporting_document'] = $path;
            }

            $letter = Letter::create($letterData);

            // Create initial history entry
            $letter->histories()->create([
                'status' => $letter->status,
                'description' => 'Letter created',
                'actor' => $request->user()->name ?? 'System',
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Letter created successfully',
                'data' => [
                    'letter' => [
                        'id' => $letter->id,
                        'name' => $letter->name,
                        'employee_name' => $letter->employee_name,
                        'letter_type' => $letter->letter_type,
                        'status' => $letter->status,
                        'valid_until' => $letter->formatted_valid_until,
                        'description' => $letter->description,
                        'supporting_document_url' => $letter->supporting_document_url,
                        'letter_format_name' => $letter->letter_format_name,
                        'formatted_created_at' => $letter->formatted_created_at,
                        'created_at' => $letter->created_at,
                    ]
                ]
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create letter',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Show specific letter
     */
    public function show(int $id): JsonResponse
    {
        $letter = Letter::with('letterFormat')->find($id);

        if (!$letter) {
            return response()->json([
                'success' => false,
                'message' => 'Letter not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Letter retrieved successfully',
            'data' => [
                'letter' => [
                    'id' => $letter->id,
                    'name' => $letter->name,
                    'employee_name' => $letter->employee_name,
                    'letter_format' => [
                        'id' => $letter->letterFormat->id_letter,
                        'name' => $letter->letterFormat->name_letter,
                        'content_url' => $letter->letterFormat->content_url,
                        'status' => $letter->letterFormat->status,
                    ],
                    'formatted_created_at' => $letter->formatted_created_at,
                    'created_at' => $letter->created_at,
                    'updated_at' => $letter->updated_at,
                ]
            ]
        ], 200);
    }

    /**
     * Update letter
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $letter = Letter::find($id);

        if (!$letter) {
            return response()->json([
                'success' => false,
                'message' => 'Letter not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name_letter_id' => 'sometimes|exists:letter_formats,id_letter',
            'employee_name' => 'sometimes|string|max:255',
            'name' => 'sometimes|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // If updating letter format, verify it's active
        if ($request->has('name_letter_id')) {
            $letterFormat = LetterFormat::where('id_letter', $request->name_letter_id)->first();
            
            if (!$letterFormat->isActive()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Selected letter format is not active'
                ], 400);
            }
        }

        try {
            $letter->update($request->only(['name_letter_id', 'employee_name', 'name']));

            return response()->json([
                'success' => true,
                'message' => 'Letter updated successfully',
                'data' => [
                    'letter' => [
                        'id' => $letter->id,
                        'name' => $letter->name,
                        'employee_name' => $letter->employee_name,
                        'letter_format_name' => $letter->letter_format_name,
                        'updated_at' => $letter->updated_at,
                    ]
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update letter',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete letter
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        // Check if user is admin or super admin
        if (!$request->user()->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Only admin or super admin can delete letters'
            ], 403);
        }

        $letter = Letter::find($id);

        if (!$letter) {
            return response()->json([
                'success' => false,
                'message' => 'Letter not found'
            ], 404);
        }

        try {
            $letter->delete();

            return response()->json([
                'success' => true,
                'message' => 'Letter deleted successfully'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete letter',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get letters by employee
     */
    public function getByEmployee(Request $request, string $employeeName): JsonResponse
    {
        $letters = Letter::with('letterFormat')
                        ->byEmployeeName($employeeName)
                        ->orderBy('created_at', 'desc')
                        ->get();

        return response()->json([
            'success' => true,
            'message' => 'Employee letters retrieved successfully',
            'data' => [
                'employee_name' => $employeeName,
                'letters' => $letters->map(function ($letter) {
                    return [
                        'id' => $letter->id,
                        'name' => $letter->name,
                        'letter_format_name' => $letter->letter_format_name,
                        'formatted_created_at' => $letter->formatted_created_at,
                        'created_at' => $letter->created_at,
                    ];
                }),
                'total_letters' => $letters->count(),
            ]
        ], 200);
    }

    /**
     * Generate letter for employee (auto-populate employee data)
     */
    public function generateForEmployee(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'employee_nik' => 'required|exists:employees,nik',
            'name_letter_id' => 'required|exists:letter_formats,id_letter',
            'name' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Get employee data
        $employee = Employee::where('nik', $request->employee_nik)->first();
        
        // Verify that the letter format is active
        $letterFormat = LetterFormat::where('id_letter', $request->name_letter_id)->first();
        
        if (!$letterFormat->isActive()) {
            return response()->json([
                'success' => false,
                'message' => 'Selected letter format is not active'
            ], 400);
        }

        try {
            $letter = Letter::create([
                'name_letter_id' => $request->name_letter_id,
                'employee_name' => $employee->full_name,
                'name' => $request->name,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Letter generated successfully for employee',
                'data' => [
                    'letter' => [
                        'id' => $letter->id,
                        'name' => $letter->name,
                        'employee_name' => $letter->employee_name,
                        'employee_nik' => $employee->nik,
                        'employee_position' => $employee->position,
                        'letter_format_name' => $letter->letter_format_name,
                        'formatted_created_at' => $letter->formatted_created_at,
                    ]
                ]
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to generate letter',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get available letter formats for dropdown
     */
    public function getAvailableFormats(): JsonResponse
    {
        $formats = LetterFormat::active()
                              ->select('id_letter', 'name_letter')
                              ->orderBy('name_letter')
                              ->get();

        return response()->json([
            'success' => true,
            'message' => 'Available letter formats retrieved successfully',
            'data' => [
                'letter_formats' => $formats->map(function ($format) {
                    return [
                        'id' => $format->id_letter,
                        'name' => $format->name_letter,
                    ];
                })
            ]
        ], 200);
    }

    /**
     * Approve letter
     */
    public function approve(Request $request, int $id): JsonResponse
    {
        // Check if user is admin or super admin
        if (!$request->user()->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Only admin or super admin can approve letters'
            ], 403);
        }

        $letter = Letter::with('histories')->find($id);

        if (!$letter) {
            return response()->json([
                'success' => false,
                'message' => 'Letter not found'
            ], 404);
        }

        if ($letter->status !== 'waiting_reviewed' && $letter->status !== 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'Letter cannot be approved in current status'
            ], 400);
        }

        try {
            $letter->update(['status' => 'approved']);

            // Add history entry
            $letter->histories()->create([
                'status' => 'approved',
                'description' => $request->input('description', 'Letter approved by admin'),
                'actor' => $request->user()->name ?? 'Admin',
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Letter approved successfully',
                'data' => [
                    'letter' => [
                        'id' => $letter->id,
                        'status' => $letter->status,
                        'updated_at' => $letter->updated_at,
                    ]
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to approve letter',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Decline letter
     */
    public function decline(Request $request, int $id): JsonResponse
    {
        // Check if user is admin or super admin
        if (!$request->user()->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Only admin or super admin can decline letters'
            ], 403);
        }

        $letter = Letter::with('histories')->find($id);

        if (!$letter) {
            return response()->json([
                'success' => false,
                'message' => 'Letter not found'
            ], 404);
        }

        if ($letter->status !== 'waiting_reviewed' && $letter->status !== 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'Letter cannot be declined in current status'
            ], 400);
        }

        $validator = Validator::make($request->all(), [
            'description' => 'required|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $letter->update(['status' => 'declined']);

            // Add history entry
            $letter->histories()->create([
                'status' => 'declined',
                'description' => $request->description,
                'actor' => $request->user()->name ?? 'Admin',
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Letter declined successfully',
                'data' => [
                    'letter' => [
                        'id' => $letter->id,
                        'status' => $letter->status,
                        'updated_at' => $letter->updated_at,
                    ]
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to decline letter',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get letter history
     */
    public function getHistory(int $id): JsonResponse
    {
        $letter = Letter::with('histories')->find($id);

        if (!$letter) {
            return response()->json([
                'success' => false,
                'message' => 'Letter not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Letter history retrieved successfully',
            'data' => [
                'letter' => [
                    'id' => $letter->id,
                    'name' => $letter->name,
                    'status' => $letter->status,
                ],
                'history' => $letter->histories->map(function ($history) {
                    return [
                        'id' => $history->id,
                        'status' => $history->status,
                        'description' => $history->description,
                        'actor' => $history->actor,
                        'date' => $history->formatted_date,
                        'created_at' => $history->created_at,
                    ];
                })
            ]
        ], 200);
    }
}