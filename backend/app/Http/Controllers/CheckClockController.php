<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CheckClock;
use App\Models\CheckClockSetting;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class CheckClockController extends Controller
{
    /**
     * Get user's clock records with pagination
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        
        $query = CheckClock::with('user.employee')
                          ->where('user_id', $user->id_users);

        // Filter by date range
        if ($request->has('start_date') && $request->has('end_date')) {
            $query->byDateRange($request->start_date, $request->end_date);
        } elseif ($request->has('date')) {
            $query->byDate($request->date);
        } else {
            // Default to current month
            $query->whereMonth('check_clock_time', now()->month)
                  ->whereYear('check_clock_time', now()->year);
        }

        // Filter by type
        if ($request->has('type')) {
            $query->byType($request->type);
        }

        $perPage = $request->get('per_page', 15);
        $checkClocks = $query->orderBy('check_clock_time', 'desc')->paginate($perPage);

        // Get today's status
        $todayStatus = $this->getTodayStatus($user->id_users);

        return response()->json([
            'success' => true,
            'message' => 'Check clock records retrieved successfully',
            'data' => [
                'check_clocks' => $checkClocks->items(),
                'pagination' => [
                    'current_page' => $checkClocks->currentPage(),
                    'last_page' => $checkClocks->lastPage(),
                    'per_page' => $checkClocks->perPage(),
                    'total' => $checkClocks->total(),
                ],
                'today_status' => $todayStatus
            ]
        ], 200);
    }

    /**
     * Clock in
     */
    public function clockIn(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = $request->user();
        $today = now()->format('Y-m-d');

        // Check if already clocked in today
        $existingClockIn = CheckClock::where('user_id', $user->id_users)
                                   ->whereDate('check_clock_time', $today)
                                   ->where('check_clock_type', 'clock_in')
                                   ->first();

        if ($existingClockIn) {
            return response()->json([
                'success' => false,
                'message' => 'You have already clocked in today',
                'data' => [
                    'clock_in_time' => $existingClockIn->formatted_time,
                    'clock_in_date' => $existingClockIn->formatted_date
                ]
            ], 400);
        }

        // Validate location if required (optional feature)
        if ($request->has('latitude') && $request->has('longitude')) {
            $locationValid = $this->validateLocation($request->latitude, $request->longitude);
            if (!$locationValid) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are not in the allowed location to clock in'
                ], 400);
            }
        }

        try {
            $checkClock = CheckClock::create([
                'user_id' => $user->id_users,
                'check_clock_type' => 'clock_in',
                'check_clock_time' => now(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Clock in successful',
                'data' => [
                    'id' => $checkClock->id,
                    'type' => $checkClock->check_clock_type,
                    'time' => $checkClock->formatted_time,
                    'date' => $checkClock->formatted_date,
                    'datetime' => $checkClock->check_clock_time->format('Y-m-d H:i:s'),
                ]
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Clock in failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Clock out
     */
    public function clockOut(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = $request->user();
        $today = now()->format('Y-m-d');

        // Check if clocked in today
        $clockIn = CheckClock::where('user_id', $user->id_users)
                            ->whereDate('check_clock_time', $today)
                            ->where('check_clock_type', 'clock_in')
                            ->first();

        if (!$clockIn) {
            return response()->json([
                'success' => false,
                'message' => 'You need to clock in first'
            ], 400);
        }

        // Check if already clocked out today
        $existingClockOut = CheckClock::where('user_id', $user->id_users)
                                    ->whereDate('check_clock_time', $today)
                                    ->where('check_clock_type', 'clock_out')
                                    ->first();

        if ($existingClockOut) {
            return response()->json([
                'success' => false,
                'message' => 'You have already clocked out today',
                'data' => [
                    'clock_out_time' => $existingClockOut->formatted_time,
                    'clock_out_date' => $existingClockOut->formatted_date
                ]
            ], 400);
        }

        // Validate location if required (optional feature)
        if ($request->has('latitude') && $request->has('longitude')) {
            $locationValid = $this->validateLocation($request->latitude, $request->longitude);
            if (!$locationValid) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are not in the allowed location to clock out'
                ], 400);
            }
        }

        try {
            $checkClock = CheckClock::create([
                'user_id' => $user->id_users,
                'check_clock_type' => 'clock_out',
                'check_clock_time' => now(),
            ]);

            // Calculate work hours
            $workHours = $this->calculateWorkHours($clockIn->check_clock_time, $checkClock->check_clock_time);

            return response()->json([
                'success' => true,
                'message' => 'Clock out successful',
                'data' => [
                    'id' => $checkClock->id,
                    'type' => $checkClock->check_clock_type,
                    'time' => $checkClock->formatted_time,
                    'date' => $checkClock->formatted_date,
                    'datetime' => $checkClock->check_clock_time->format('Y-m-d H:i:s'),
                    'work_hours' => $workHours,
                ]
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Clock out failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Break start
     */
    public function breakStart(Request $request): JsonResponse
    {
        $user = $request->user();
        $today = now()->format('Y-m-d');

        // Check if clocked in today
        $clockIn = CheckClock::where('user_id', $user->id_users)
                            ->whereDate('check_clock_time', $today)
                            ->where('check_clock_type', 'clock_in')
                            ->first();

        if (!$clockIn) {
            return response()->json([
                'success' => false,
                'message' => 'You need to clock in first'
            ], 400);
        }

        // Check if already on break
        $existingBreakStart = CheckClock::where('user_id', $user->id_users)
                                      ->whereDate('check_clock_time', $today)
                                      ->where('check_clock_type', 'break_start')
                                      ->whereDoesntHave('user', function ($query) use ($today) {
                                          $query->whereHas('checkClocks', function ($q) use ($today) {
                                              $q->whereDate('check_clock_time', $today)
                                                ->where('check_clock_type', 'break_end');
                                          });
                                      })
                                      ->first();

        if ($existingBreakStart) {
            return response()->json([
                'success' => false,
                'message' => 'You are already on break'
            ], 400);
        }

        try {
            $checkClock = CheckClock::create([
                'user_id' => $user->id_users,
                'check_clock_type' => 'break_start',
                'check_clock_time' => now(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Break started',
                'data' => [
                    'id' => $checkClock->id,
                    'type' => $checkClock->check_clock_type,
                    'time' => $checkClock->formatted_time,
                    'date' => $checkClock->formatted_date,
                ]
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Break start failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Break end
     */
    public function breakEnd(Request $request): JsonResponse
    {
        $user = $request->user();
        $today = now()->format('Y-m-d');

        // Check if on break
        $breakStart = CheckClock::where('user_id', $user->id_users)
                               ->whereDate('check_clock_time', $today)
                               ->where('check_clock_type', 'break_start')
                               ->latest()
                               ->first();

        if (!$breakStart) {
            return response()->json([
                'success' => false,
                'message' => 'You are not on break'
            ], 400);
        }

        // Check if break already ended
        $breakEnd = CheckClock::where('user_id', $user->id_users)
                             ->whereDate('check_clock_time', $today)
                             ->where('check_clock_type', 'break_end')
                             ->where('check_clock_time', '>', $breakStart->check_clock_time)
                             ->first();

        if ($breakEnd) {
            return response()->json([
                'success' => false,
                'message' => 'Break already ended'
            ], 400);
        }

        try {
            $checkClock = CheckClock::create([
                'user_id' => $user->id_users,
                'check_clock_type' => 'break_end',
                'check_clock_time' => now(),
            ]);

            // Calculate break duration
            $breakDuration = $this->calculateBreakDuration($breakStart->check_clock_time, $checkClock->check_clock_time);

            return response()->json([
                'success' => true,
                'message' => 'Break ended',
                'data' => [
                    'id' => $checkClock->id,
                    'type' => $checkClock->check_clock_type,
                    'time' => $checkClock->formatted_time,
                    'date' => $checkClock->formatted_date,
                    'break_duration' => $breakDuration,
                ]
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Break end failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get today's attendance status
     */
    public function todayStatus(Request $request): JsonResponse
    {
        $user = $request->user();
        $status = $this->getTodayStatus($user->id_users);

        return response()->json([
            'success' => true,
            'message' => 'Today status retrieved successfully',
            'data' => $status
        ], 200);
    }

    /**
     * Get attendance summary for admin
     */
    public function attendanceSummary(Request $request): JsonResponse
    {
        // Check if user is admin or super admin
        if (!$request->user()->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Only admin or super admin can view attendance summary'
            ], 403);
        }

        $date = $request->get('date', now()->format('Y-m-d'));

        $summary = CheckClock::with('user.employee')
                            ->whereDate('check_clock_time', $date)
                            ->get()
                            ->groupBy('user_id')
                            ->map(function ($userClocks) {
                                $user = $userClocks->first()->user;
                                $clockIn = $userClocks->where('check_clock_type', 'clock_in')->first();
                                $clockOut = $userClocks->where('check_clock_type', 'clock_out')->first();
                                
                                return [
                                    'user_id' => $user->id_users,
                                    'employee_name' => $user->name,
                                    'employee_nik' => $user->employee_id,
                                    'position' => $user->employee?->position,
                                    'clock_in' => $clockIn ? $clockIn->formatted_time : null,
                                    'clock_out' => $clockOut ? $clockOut->formatted_time : null,
                                    'work_hours' => ($clockIn && $clockOut) ? 
                                        $this->calculateWorkHours($clockIn->check_clock_time, $clockOut->check_clock_time) : null,
                                    'status' => $this->getAttendanceStatus($clockIn, $clockOut),
                                ];
                            })
                            ->values();

        return response()->json([
            'success' => true,
            'message' => 'Attendance summary retrieved successfully',
            'data' => [
                'date' => $date,
                'attendance' => $summary,
                'statistics' => [
                    'total_employees' => $summary->count(),
                    'present' => $summary->where('status', 'Present')->count(),
                    'late' => $summary->where('status', 'Late')->count(),
                    'absent' => $summary->where('status', 'Absent')->count(),
                ]
            ]
        ], 200);
    }

    /**
     * Helper: Get today's status for user
     */
    private function getTodayStatus(int $userId): array
    {
        $today = now()->format('Y-m-d');
        
        $todayClocks = CheckClock::where('user_id', $userId)
                                ->whereDate('check_clock_time', $today)
                                ->orderBy('check_clock_time')
                                ->get();

        $clockIn = $todayClocks->where('check_clock_type', 'clock_in')->first();
        $clockOut = $todayClocks->where('check_clock_type', 'clock_out')->first();
        $breakStart = $todayClocks->where('check_clock_type', 'break_start')->last();
        $breakEnd = $todayClocks->where('check_clock_type', 'break_end')->last();

        return [
            'date' => $today,
            'clock_in' => $clockIn ? [
                'time' => $clockIn->formatted_time,
                'datetime' => $clockIn->check_clock_time->format('Y-m-d H:i:s'),
            ] : null,
            'clock_out' => $clockOut ? [
                'time' => $clockOut->formatted_time,
                'datetime' => $clockOut->check_clock_time->format('Y-m-d H:i:s'),
            ] : null,
            'on_break' => $breakStart && (!$breakEnd || $breakEnd->check_clock_time < $breakStart->check_clock_time),
            'work_hours' => ($clockIn && $clockOut) ? 
                $this->calculateWorkHours($clockIn->check_clock_time, $clockOut->check_clock_time) : null,
            'status' => $this->getAttendanceStatus($clockIn, $clockOut),
            'can_clock_in' => !$clockIn,
            'can_clock_out' => $clockIn && !$clockOut,
            'can_break_start' => $clockIn && !$clockOut && (!$breakStart || ($breakEnd && $breakEnd->check_clock_time > $breakStart->check_clock_time)),
            'can_break_end' => $breakStart && (!$breakEnd || $breakEnd->check_clock_time < $breakStart->check_clock_time),
        ];
    }

    /**
     * Helper: Calculate work hours between two times
     */
    private function calculateWorkHours(Carbon $clockIn, Carbon $clockOut): string
    {
        $diff = $clockOut->diff($clockIn);
        return sprintf('%02d:%02d', $diff->h, $diff->i);
    }

    /**
     * Helper: Calculate break duration
     */
    private function calculateBreakDuration(Carbon $breakStart, Carbon $breakEnd): string
    {
        $diff = $breakEnd->diff($breakStart);
        return sprintf('%02d:%02d', $diff->h, $diff->i);
    }

    /**
     * Helper: Get attendance status
     */
    private function getAttendanceStatus($clockIn, $clockOut): string
    {
        if (!$clockIn) {
            return 'Absent';
        }
        
        // You can customize this logic based on your business rules
        $workStartTime = Carbon::createFromFormat('H:i', '09:00');
        $clockInTime = Carbon::createFromFormat('H:i', $clockIn->check_clock_time->format('H:i'));
        
        if ($clockInTime->gt($workStartTime)) {
            return 'Late';
        }
        
        return 'Present';
    }

    /**
     * Helper: Validate location (optional feature)
     */
    private function validateLocation(float $latitude, float $longitude): bool
    {
        // Get allowed locations from settings
        $allowedLocations = CheckClockSetting::all();
        
        foreach ($allowedLocations as $location) {
            $coords = $location->geo_location;
            if ($coords) {
                $distance = $this->calculateDistance(
                    $latitude, 
                    $longitude, 
                    (float)$coords['latitude'], 
                    (float)$coords['longitude']
                );
                
                // Allow if within 100 meters (you can customize this)
                if ($distance <= 0.1) { // 0.1 km = 100 meters
                    return true;
                }
            }
        }
        
        return false;
    }

    /**
     * Helper: Calculate distance between two coordinates
     */
    private function calculateDistance(float $lat1, float $lon1, float $lat2, float $lon2): float
    {
        $earth_radius = 6371; // km

        $dLat = deg2rad($lat2 - $lat1);
        $dLon = deg2rad($lon2 - $lon1);

        $a = sin($dLat/2) * sin($dLat/2) + cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * sin($dLon/2) * sin($dLon/2);
        $c = 2 * asin(sqrt($a));
        $d = $earth_radius * $c;

        return $d;
    }
}