<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Overtime;
use App\Helpers\TimezoneHelper;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class OvertimeController extends Controller
{
    /**
     * Get all overtime requests with pagination and filters
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        
        // For regular users, only show their own overtime requests
        // For admins, show all overtime requests
        $query = Overtime::with(['user.employee', 'approver.employee']);
        
        if (!$user->isAdmin()) {
            $query->byUser($user->id_users);
        }

        // Search functionality
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('reason', 'like', '%' . $search . '%')
                  ->orWhere('tasks_completed', 'like', '%' . $search . '%')
                  ->orWhereHas('user.employee', function ($userQuery) use ($search) {
                      $userQuery->where('first_name', 'like', '%' . $search . '%')
                               ->orWhere('last_name', 'like', '%' . $search . '%');
                  });
            });
        }

        // Status filter
        if ($request->has('status') && $request->status) {
            $query->byStatus($request->status);
        }

        // Date range filter
        if ($request->has('date_from') && $request->has('date_to')) {
            $query->byDateRange($request->date_from, $request->date_to);
        } elseif ($request->has('date')) {
            $query->byDate($request->date);
        }

        // Employee filter (admin only)
        if ($request->has('employee_id') && $request->employee_id && $user->isAdmin()) {
            $query->byUser($request->employee_id);
        }

        $perPage = $request->get('per_page', 10);
        $overtimes = $query->orderBy('created_at', 'desc')->paginate($perPage);

        return response()->json([
            'success' => true,
            'message' => 'Overtime requests retrieved successfully',
            'data' => [
                'overtimes' => $overtimes->items(),
                'pagination' => [
                    'current_page' => $overtimes->currentPage(),
                    'last_page' => $overtimes->lastPage(),
                    'per_page' => $overtimes->perPage(),
                    'total' => $overtimes->total(),
                    'from' => $overtimes->firstItem(),
                    'to' => $overtimes->lastItem(),
                ]
            ]
        ], 200);
    }

    /**
     * Store new overtime request
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'overtime_date' => 'required|date|after_or_equal:today',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'nullable|date_format:H:i|after:start_time',
            'reason' => 'required|string|max:1000',
            'tasks_completed' => 'nullable|string|max:2000',
            'supporting_document' => 'nullable|file|mimes:pdf,doc,docx,jpg,jpeg,png|max:5120', // Max 5MB
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $user = $request->user();
            
            // Check if user already has overtime request for the same date
            $existingOvertime = Overtime::where('user_id', $user->id_users)
                                       ->where('overtime_date', $request->overtime_date)
                                       ->where('status', '!=', 'rejected')
                                       ->first();

            if ($existingOvertime) {
                return response()->json([
                    'success' => false,
                    'message' => 'You already have an overtime request for this date'
                ], 400);
            }

            // Calculate duration only if end_time is provided
            $durationHours = null;
            if ($request->end_time) {
                // Use Jakarta timezone for time calculations
                $startTime = Carbon::createFromFormat('H:i', $request->start_time, TimezoneHelper::JAKARTA_TIMEZONE);
                $endTime = Carbon::createFromFormat('H:i', $request->end_time, TimezoneHelper::JAKARTA_TIMEZONE);
                
                // Handle overnight overtime
                if ($endTime->lt($startTime)) {
                    $endTime->addDay();
                }
                
                $durationHours = TimezoneHelper::calculateDurationHours($startTime, $endTime);
            }

            // Handle file upload
            $documentPath = null;
            if ($request->hasFile('supporting_document')) {
                $documentPath = $request->file('supporting_document')->store('overtime/documents', 'public');
            }

            $overtime = Overtime::create([
                'user_id' => $user->id_users,
                'overtime_date' => $request->overtime_date,
                'start_time' => $request->start_time,
                'end_time' => $request->end_time,
                'duration_hours' => $durationHours,
                'reason' => $request->reason,
                'tasks_completed' => $request->tasks_completed,
                'supporting_document' => $documentPath,
                'status' => 'pending',
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Overtime request submitted successfully',
                'data' => [
                    'overtime' => $overtime->load(['user.employee'])
                ]
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create overtime request',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Show specific overtime request
     */
    public function show(int $id): JsonResponse
    {
        $overtime = Overtime::with(['user.employee', 'approver.employee'])->find($id);

        if (!$overtime) {
            return response()->json([
                'success' => false,
                'message' => 'Overtime request not found'
            ], 404);
        }

        // Check permission - users can only see their own overtime, admins can see all
        $user = request()->user();
        if (!$user->isAdmin() && $overtime->user_id !== $user->id_users) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized access'
            ], 403);
        }

        return response()->json([
            'success' => true,
            'message' => 'Overtime request retrieved successfully',
            'data' => [
                'overtime' => $overtime
            ]
        ], 200);
    }

    /**
     * Update overtime request (only for pending requests by owner)
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $overtime = Overtime::find($id);

        if (!$overtime) {
            return response()->json([
                'success' => false,
                'message' => 'Overtime request not found'
            ], 404);
        }

        $user = $request->user();

        // Only the owner can update pending overtime requests
        if ($overtime->user_id !== $user->id_users) {
            return response()->json([
                'success' => false,
                'message' => 'You can only update your own overtime requests'
            ], 403);
        }

        if ($overtime->status !== 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'Only pending overtime requests can be updated'
            ], 400);
        }

        $validator = Validator::make($request->all(), [
            'overtime_date' => 'sometimes|date|after_or_equal:today',
            'start_time' => 'sometimes|date_format:H:i',
            'end_time' => 'sometimes|date_format:H:i|after:start_time',
            'reason' => 'sometimes|string|max:1000',
            'tasks_completed' => 'nullable|string|max:2000',
            'supporting_document' => 'nullable|file|mimes:pdf,doc,docx,jpg,jpeg,png|max:5120',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $updateData = $request->only(['overtime_date', 'start_time', 'end_time', 'reason', 'tasks_completed']);

            // Recalculate duration if time is updated
            if ($request->has('start_time') || $request->has('end_time')) {
                $startTime = Carbon::createFromFormat('H:i', $request->start_time ?? $overtime->start_time);
                $endTime = Carbon::createFromFormat('H:i', $request->end_time ?? $overtime->end_time);
                
                if ($endTime->lt($startTime)) {
                    $endTime->addDay();
                }
                
                $updateData['duration_hours'] = $startTime->diffInMinutes($endTime) / 60;
            }

            // Handle file upload
            if ($request->hasFile('supporting_document')) {
                // Delete old file if exists
                if ($overtime->supporting_document) {
                    Storage::disk('public')->delete($overtime->supporting_document);
                }
                $updateData['supporting_document'] = $request->file('supporting_document')->store('overtime/documents', 'public');
            }

            $overtime->update($updateData);

            return response()->json([
                'success' => true,
                'message' => 'Overtime request updated successfully',
                'data' => [
                    'overtime' => $overtime->load(['user.employee'])
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update overtime request',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete overtime request (only pending requests by owner or admin)
     */
    public function destroy(int $id): JsonResponse
    {
        $overtime = Overtime::find($id);

        if (!$overtime) {
            return response()->json([
                'success' => false,
                'message' => 'Overtime request not found'
            ], 404);
        }

        $user = request()->user();

        // Check permission
        if (!$user->isAdmin() && $overtime->user_id !== $user->id_users) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized access'
            ], 403);
        }

        // Only pending requests can be deleted
        if ($overtime->status !== 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'Only pending overtime requests can be deleted'
            ], 400);
        }

        try {
            // Delete supporting document if exists
            if ($overtime->supporting_document) {
                Storage::disk('public')->delete($overtime->supporting_document);
            }

            $overtime->delete();

            return response()->json([
                'success' => true,
                'message' => 'Overtime request deleted successfully'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete overtime request',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Approve overtime request (admin only)
     */
    public function approve(Request $request, int $id): JsonResponse
    {
        // Check if user is admin
        if (!$request->user()->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Only admin or super admin can approve overtime requests'
            ], 403);
        }

        $overtime = Overtime::find($id);

        if (!$overtime) {
            return response()->json([
                'success' => false,
                'message' => 'Overtime request not found'
            ], 404);
        }

        if ($overtime->status !== 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'Only pending overtime requests can be approved'
            ], 400);
        }

        $validator = Validator::make($request->all(), [
            'admin_notes' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $overtime->update([
                'status' => 'approved',
                'approved_by' => $request->user()->id_users,
                'approved_at' => now(),
                'admin_notes' => $request->admin_notes,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Overtime request approved successfully',
                'data' => [
                    'overtime' => $overtime->load(['user.employee', 'approver.employee'])
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to approve overtime request',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Reject overtime request (admin only)
     */
    public function reject(Request $request, int $id): JsonResponse
    {
        // Check if user is admin
        if (!$request->user()->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Only admin or super admin can reject overtime requests'
            ], 403);
        }

        $overtime = Overtime::find($id);

        if (!$overtime) {
            return response()->json([
                'success' => false,
                'message' => 'Overtime request not found'
            ], 404);
        }

        if ($overtime->status !== 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'Only pending overtime requests can be rejected'
            ], 400);
        }

        $validator = Validator::make($request->all(), [
            'admin_notes' => 'required|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $overtime->update([
                'status' => 'rejected',
                'approved_by' => $request->user()->id_users,
                'approved_at' => now(),
                'admin_notes' => $request->admin_notes,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Overtime request rejected successfully',
                'data' => [
                    'overtime' => $overtime->load(['user.employee', 'approver.employee'])
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to reject overtime request',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Complete overtime request by uploading completion evidence with end time
     */
    public function complete(Request $request, int $id): JsonResponse
    {
        $overtime = Overtime::find($id);

        if (!$overtime) {
            return response()->json([
                'success' => false,
                'message' => 'Overtime request not found'
            ], 404);
        }

        $user = $request->user();

        // Only the owner can complete their overtime requests
        if ($overtime->user_id !== $user->id_users) {
            return response()->json([
                'success' => false,
                'message' => 'You can only complete your own overtime requests'
            ], 403);
        }

        // Can only complete pending overtime requests that don't have end_time yet
        if ($overtime->status !== 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'Only pending overtime requests can be completed'
            ], 400);
        }

        if ($overtime->end_time) {
            return response()->json([
                'success' => false,
                'message' => 'This overtime request has already been completed'
            ], 400);
        }

        $validator = Validator::make($request->all(), [
            'end_time' => 'required|date_format:H:i|after:' . $overtime->start_time,
            'supporting_document' => 'nullable|file|mimes:pdf,doc,docx,jpg,jpeg,png|max:5120', // Max 5MB
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Calculate duration using Jakarta timezone
            $startTime = Carbon::createFromFormat('H:i', $overtime->start_time, TimezoneHelper::JAKARTA_TIMEZONE);
            $endTime = Carbon::createFromFormat('H:i', $request->end_time, TimezoneHelper::JAKARTA_TIMEZONE);
            
            // Handle overnight overtime
            if ($endTime->lt($startTime)) {
                $endTime->addDay();
            }
            
            $durationHours = TimezoneHelper::calculateDurationHours($startTime, $endTime);

            $updateData = [
                'end_time' => $request->end_time,
                'duration_hours' => $durationHours,
            ];

            // Handle file upload for completion evidence
            if ($request->hasFile('supporting_document')) {
                // Delete old document if exists
                if ($overtime->supporting_document) {
                    Storage::disk('public')->delete($overtime->supporting_document);
                }
                $updateData['supporting_document'] = $request->file('supporting_document')->store('overtime/documents', 'public');
            }

            $overtime->update($updateData);

            return response()->json([
                'success' => true,
                'message' => 'Overtime completion evidence uploaded successfully',
                'data' => [
                    'overtime' => $overtime->load(['user.employee'])
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to complete overtime request',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get overtime statistics (admin only)
     */
    public function statistics(Request $request): JsonResponse
    {
        // Check if user is admin
        if (!$request->user()->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Only admin or super admin can access statistics'
            ], 403);
        }

        try {
            $startDate = $request->get('start_date', now()->startOfMonth()->format('Y-m-d'));
            $endDate = $request->get('end_date', now()->endOfMonth()->format('Y-m-d'));

            $totalRequests = Overtime::byDateRange($startDate, $endDate)->count();
            $pendingRequests = Overtime::byDateRange($startDate, $endDate)->pending()->count();
            $approvedRequests = Overtime::byDateRange($startDate, $endDate)->approved()->count();
            $rejectedRequests = Overtime::byDateRange($startDate, $endDate)->rejected()->count();
            
            $totalHours = Overtime::byDateRange($startDate, $endDate)
                                 ->approved()
                                 ->sum('duration_hours');

            $topEmployees = Overtime::with('user.employee')
                                   ->byDateRange($startDate, $endDate)
                                   ->approved()
                                   ->selectRaw('user_id, SUM(duration_hours) as total_hours, COUNT(*) as total_requests')
                                   ->groupBy('user_id')
                                   ->orderBy('total_hours', 'desc')
                                   ->limit(10)
                                   ->get();

            return response()->json([
                'success' => true,
                'message' => 'Overtime statistics retrieved successfully',
                'data' => [
                    'period' => [
                        'start_date' => $startDate,
                        'end_date' => $endDate
                    ],
                    'summary' => [
                        'total_requests' => $totalRequests,
                        'pending_requests' => $pendingRequests,
                        'approved_requests' => $approvedRequests,
                        'rejected_requests' => $rejectedRequests,
                        'total_approved_hours' => round($totalHours, 2),
                        'approval_rate' => $totalRequests > 0 ? round(($approvedRequests / $totalRequests) * 100, 2) : 0
                    ],
                    'top_employees' => $topEmployees
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve statistics',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get timezone information for frontend
     */
    public function timezoneInfo(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => TimezoneHelper::getTimezoneInfo()
        ], 200);
    }
}