<?php

namespace App\Http\Controllers;

use App\Models\CheckClock;
use App\Models\CheckClockSetting;
use App\Helpers\TimezoneHelper;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class CheckClockController extends Controller
{
    /**
     * Get user's clock records with pagination and filters
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        
        $query = CheckClock::with('user.employee')
            ->byUser($user->id_users);

        // Search filter
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->whereDate('check_clock_time', 'like', "%{$search}%")
                  ->orWhere('check_clock_type', 'like', "%{$search}%");
            });
        }

        // Date range filter
        if ($request->has('date_from') && $request->has('date_to')) {
            $query->byDateRange($request->date_from, $request->date_to);
        } elseif ($request->has('date')) {
            $query->byDate($request->date);
        } else {
            // Default to current month
            $query->whereMonth('check_clock_time', now()->month)
                  ->whereYear('check_clock_time', now()->year);
        }

        // Status filter
        if ($request->has('status')) {
            $status = $request->status;
            if ($status !== 'All Status') {
                // We'll filter this after getting the data since status is calculated
                $query->whereHas('user.employee');
            }
        }

        // Type filter
        if ($request->has('type')) {
            $query->byType($request->type);
        }

        $perPage = $request->get('per_page', 15);
        $checkClocks = $query->orderBy('check_clock_time', 'desc')->paginate($perPage);

        // Group by date and transform data
        $groupedData = $this->groupByDateAndTransform($checkClocks->items(), $request->status ?? null);

        // Get today's status
        $todayStatus = $this->getTodayStatus($user->id_users);

        return response()->json([
            'success' => true,
            'data' => $groupedData,
            'pagination' => [
                'current_page' => $checkClocks->currentPage(),
                'last_page' => $checkClocks->lastPage(),
                'per_page' => $checkClocks->perPage(),
                'total' => $checkClocks->total(),
                'from' => $checkClocks->firstItem(),
                'to' => $checkClocks->lastItem(),
            ],
            'today_status' => $todayStatus,
            'filters_applied' => [
                'search' => $request->search,
                'date_from' => $request->date_from,
                'date_to' => $request->date_to,
                'status' => $request->status,
                'type' => $request->type
            ]
        ], 200);
    }

    /**
     * Clock in
     */
    public function clockIn(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'address' => 'required|string|max:500',
            'supporting_evidence' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = $request->user();

        // Check if already clocked in today
        $existingClockIn = CheckClock::byUser($user->id_users)
            ->today()
            ->clockIn()
            ->first();

        if ($existingClockIn) {
            return response()->json([
                'success' => false,
                'message' => 'You have already clocked in today at ' . \App\Helpers\TimezoneHelper::formatJakartaTime($existingClockIn->check_clock_time, 'H:i:s') . ' WIB'
            ], 400);
        }

        // Validate location if required
        $locationValidation = $this->validateLocation($request->latitude, $request->longitude);
        if (!$locationValidation['valid']) {
            return response()->json([
                'success' => false,
                'message' => $locationValidation['message'],
                'distance' => $locationValidation['distance']
            ], 400);
        }

        // Handle file upload
        $evidencePath = null;
        if ($request->hasFile('supporting_evidence')) {
            $evidencePath = $request->file('supporting_evidence')->store('attendance/evidence', 'public');
        }

        // Create clock in record
        $checkClock = CheckClock::create([
            'user_id' => $user->id_users,
            'check_clock_type' => 'clock_in',
            'check_clock_time' => now(),
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'address' => $request->address,
            'supporting_evidence' => $evidencePath
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Clock in successful',
            'data' => $this->transformCheckClockData($checkClock),
            'location_info' => $locationValidation
        ], 201);
    }

    /**
     * Clock out
     */
    public function clockOut(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'address' => 'required|string|max:500',
            'supporting_evidence' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = $request->user();

        // Check if clocked in today
        $clockInToday = CheckClock::byUser($user->id_users)
            ->today()
            ->clockIn()
            ->first();

        if (!$clockInToday) {
            return response()->json([
                'success' => false,
                'message' => 'You need to clock in first before clocking out'
            ], 400);
        }

        // Check if already clocked out
        $existingClockOut = CheckClock::byUser($user->id_users)
            ->today()
            ->clockOut()
            ->first();

        if ($existingClockOut) {
            return response()->json([
                'success' => false,
                'message' => 'You have already clocked out today at ' . \App\Helpers\TimezoneHelper::formatJakartaTime($existingClockOut->check_clock_time, 'H:i:s') . ' WIB'
            ], 400);
        }

        // Validate location if required
        $locationValidation = $this->validateLocation($request->latitude, $request->longitude);
        if (!$locationValidation['valid']) {
            return response()->json([
                'success' => false,
                'message' => $locationValidation['message'],
                'distance' => $locationValidation['distance']
            ], 400);
        }

        // Handle file upload
        $evidencePath = null;
        if ($request->hasFile('supporting_evidence')) {
            $evidencePath = $request->file('supporting_evidence')->store('attendance/evidence', 'public');
        }

        // Create clock out record
        $checkClock = CheckClock::create([
            'user_id' => $user->id_users,
            'check_clock_type' => 'clock_out',
            'check_clock_time' => now(),
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'address' => $request->address,
            'supporting_evidence' => $evidencePath
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Clock out successful',
            'data' => $this->transformCheckClockData($checkClock),
            'location_info' => $locationValidation
        ], 201);
    }

    /**
     * Break start
     */
    public function breakStart(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'address' => 'required|string|max:500'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = $request->user();

        // Check if clocked in today
        $clockInToday = CheckClock::byUser($user->id_users)
            ->today()
            ->clockIn()
            ->first();

        if (!$clockInToday) {
            return response()->json([
                'success' => false,
                'message' => 'You need to clock in first before taking a break'
            ], 400);
        }

        // Check if already on break
        $breakStart = CheckClock::byUser($user->id_users)
            ->today()
            ->byType('break_start')
            ->first();

        if ($breakStart) {
            // Check if there's already a break_end for this break_start
            $breakEnd = CheckClock::byUser($user->id_users)
                ->today()
                ->byType('break_end')
                ->where('check_clock_time', '>', $breakStart->check_clock_time)
                ->first();

            if (!$breakEnd) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are already on break since ' . \App\Helpers\TimezoneHelper::formatJakartaTime($breakStart->check_clock_time, 'H:i:s') . ' WIB'
                ], 400);
            }
        }

        // Create break start record
        $checkClock = CheckClock::create([
            'user_id' => $user->id_users,
            'check_clock_type' => 'break_start',
            'check_clock_time' => now(),
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'address' => $request->address
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Break started successfully',
            'data' => $this->transformCheckClockData($checkClock)
        ], 201);
    }

    /**
     * Break end
     */
    public function breakEnd(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'address' => 'required|string|max:500'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = $request->user();

        // Check if on break
        $breakStart = CheckClock::byUser($user->id_users)
            ->today()
            ->byType('break_start')
            ->first();

        if (!$breakStart) {
            return response()->json([
                'success' => false,
                'message' => 'You need to start a break first'
            ], 400);
        }

        // Check if break already ended
        $breakEnd = CheckClock::byUser($user->id_users)
            ->today()
            ->byType('break_end')
            ->first();

        if ($breakEnd) {
            return response()->json([
                'success' => false,
                'message' => 'Break already ended at ' . \App\Helpers\TimezoneHelper::formatJakartaTime($breakEnd->check_clock_time, 'H:i:s') . ' WIB'
            ], 400);
        }

        // Create break end record
        $checkClock = CheckClock::create([
            'user_id' => $user->id_users,
            'check_clock_type' => 'break_end',
            'check_clock_time' => now(),
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'address' => $request->address
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Break ended successfully',
            'data' => $this->transformCheckClockData($checkClock)
        ], 201);
    }

    /**
     * Get today's status
     */
    public function todayStatus(Request $request): JsonResponse
    {
        $user = $request->user();
        $todayStatus = $this->getTodayStatus($user->id_users);

        return response()->json([
            'success' => true,
            'data' => $todayStatus
        ], 200);
    }

    /**
     * Get attendance summary (Admin only)
     */
    public function attendanceSummary(Request $request): JsonResponse
    {
        // Check if user is admin
        if (!in_array($request->user()->role, ['admin', 'super_admin'])) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized access'
            ], 403);
        }

        $startDate = $request->get('start_date', now()->startOfMonth()->format('Y-m-d'));
        $endDate = $request->get('end_date', now()->endOfMonth()->format('Y-m-d'));

        $records = CheckClock::with('user.employee')
            ->byDateRange($startDate, $endDate)
            ->get();

        $summary = $records->groupBy('user_id')
            ->map(function ($userRecords) {
                return $this->calculateAttendanceSummary($userRecords);
            })
            ->values();

        return response()->json([
            'success' => true,
            'data' => $summary,
            'period' => [
                'start_date' => $startDate,
                'end_date' => $endDate
            ],
            'total_employees' => $summary->count()
        ], 200);
    }

    /**
     * Group check clocks by date and transform to match frontend format
     */
    private function groupByDateAndTransform($checkClocks, $statusFilter = null): array
    {
        $grouped = collect($checkClocks)->groupBy(function ($item) {
            return Carbon::parse($item->check_clock_time)->format('Y-m-d');
        });

        $result = [];
        
        foreach ($grouped as $date => $dayRecords) {
            $clockIn = $dayRecords->where('check_clock_type', 'clock_in')->first();
            $clockOut = $dayRecords->where('check_clock_type', 'clock_out')->first();
            
            $workHours = null;
            $status = 'Absent';
            
            if ($clockIn && $clockOut) {
                $workHours = $this->calculateWorkHours(
                    Carbon::parse($clockIn->check_clock_time),
                    Carbon::parse($clockOut->check_clock_time)
                );
                $status = $this->getAttendanceStatus($clockIn, $clockOut);
            } elseif ($clockIn) {
                $status = 'Incomplete';
                $workHours = 'In Progress';
            }

            // Apply status filter
            if ($statusFilter && $statusFilter !== 'All Status' && $status !== $statusFilter) {
                continue;
            }

            $result[] = [
                'id' => $clockIn->id ?? $clockOut->id ?? $dayRecords->first()->id,
                'date' => Carbon::parse($date)->format('F d, Y'),
                'clockIn' => $clockIn ? Carbon::parse($clockIn->check_clock_time)->format('h:i A') : '-',
                'clockOut' => $clockOut ? Carbon::parse($clockOut->check_clock_time)->format('h:i A') : '-',
                'workHours' => $workHours ?? '-',
                'status' => $status,
                'statusColor' => $this->getStatusColor($status)
            ];
        }

        return $result;
    }

    /**
     * Get today's status for user
     */
    private function getTodayStatus(int $userId): array
    {
        $today = TimezoneHelper::getJakartaDate();
        
        $clockIn = CheckClock::byUser($userId)->today()->clockIn()->first();
        $clockOut = CheckClock::byUser($userId)->today()->clockOut()->first();
        $breakStart = CheckClock::byUser($userId)->today()->byType('break_start')->first();
        $breakEnd = CheckClock::byUser($userId)->today()->byType('break_end')->first();

        $workHours = null;
        $status = 'Not Started';

        if ($clockIn && $clockOut) {
            $workHours = $this->calculateWorkHours(
                Carbon::parse($clockIn->check_clock_time),
                Carbon::parse($clockOut->check_clock_time)
            );
            $status = 'Completed';
        } elseif ($clockIn) {
            if ($breakStart && !$breakEnd) {
                $status = 'On Break';
            } else {
                $status = 'In Progress';
            }
        }

        return [
            'date' => $today,
            'formatted_date' => TimezoneHelper::formatJakartaDate(now(), 'l, F j, Y'),
            'clock_in' => $clockIn ? TimezoneHelper::formatJakartaTime($clockIn->check_clock_time, 'H:i:s') . ' WIB' : null,
            'clock_out' => $clockOut ? TimezoneHelper::formatJakartaTime($clockOut->check_clock_time, 'H:i:s') . ' WIB' : null,
            'work_hours' => $workHours,
            'status' => $status,
            'break_start' => $breakStart ? TimezoneHelper::formatJakartaTime($breakStart->check_clock_time, 'H:i:s') . ' WIB' : null,
            'break_end' => $breakEnd ? TimezoneHelper::formatJakartaTime($breakEnd->check_clock_time, 'H:i:s') . ' WIB' : null,
        ];
    }

    /**
     * Transform check clock data for frontend
     */
    private function transformCheckClockData($checkClock): array
    {
        return [
            'id' => $checkClock->id,
            'user_id' => $checkClock->user_id,
            'type' => $checkClock->check_clock_type,
            'time' => Carbon::parse($checkClock->check_clock_time)->format('Y-m-d H:i:s'),
            'formatted_time' => Carbon::parse($checkClock->check_clock_time)->format('h:i A'),
            'formatted_date' => Carbon::parse($checkClock->check_clock_time)->format('F d, Y'),
            'latitude' => $checkClock->latitude,
            'longitude' => $checkClock->longitude,
            'address' => $checkClock->address,
            'supporting_evidence' => $checkClock->supporting_evidence ? Storage::url($checkClock->supporting_evidence) : null,
            'created_at' => $checkClock->created_at
        ];
    }

    /**
     * Calculate work hours between clock in and clock out
     */
    private function calculateWorkHours(Carbon $clockIn, Carbon $clockOut): string
    {
        $diffInMinutes = $clockIn->diffInMinutes($clockOut);
        $hours = intval($diffInMinutes / 60);
        $minutes = $diffInMinutes % 60;
        
        return sprintf('%dh %dm', $hours, $minutes);
    }

    /**
     * Get attendance status based on clock in/out times
     */
    private function getAttendanceStatus($clockIn, $clockOut): string
    {
        // Get work schedule from settings
        $settings = CheckClockSetting::first();
        $workStartTime = '09:00:00'; // Default
        
        if ($settings) {
            $timeSettings = $settings->times()->first();
            if ($timeSettings) {
                $workStartTime = $timeSettings->clock_in;
            }
        }
        
        $clockInTime = Carbon::parse($clockIn->check_clock_time)->format('H:i:s');
        
        if ($clockInTime > $workStartTime) {
            return 'Late';
        }
        
        return 'On Time';
    }

    /**
     * Get status color for frontend
     */
    private function getStatusColor(string $status): string
    {
        return match($status) {
            'On Time' => 'green',
            'Late' => 'red',
            'Absent' => 'gray',
            'Incomplete' => 'yellow',
            default => 'gray'
        };
    }

    /**
     * Validate if user is within allowed location
     */
    private function validateLocation(float $latitude, float $longitude): array
    {
        // Get office location from settings
        $officeSettings = CheckClockSetting::first();
        
        if (!$officeSettings || !$officeSettings->office_latitude || !$officeSettings->office_longitude) {
            return [
                'valid' => true,
                'message' => 'Location validation disabled - no office location configured',
                'distance' => 0
            ];
        }
        
        $distance = $this->calculateDistance(
            $latitude,
            $longitude,
            $officeSettings->office_latitude,
            $officeSettings->office_longitude
        );
        
        $allowedRadius = $officeSettings->location_radius ?? 1000; // Default 1km
        
        $isValid = $distance <= $allowedRadius;
        
        return [
            'valid' => $isValid,
            'message' => $isValid 
                ? 'Location verified - within office area' 
                : "You are {$distance}m away from office. Maximum allowed distance is {$allowedRadius}m",
            'distance' => round($distance, 2),
            'allowed_radius' => $allowedRadius
        ];
    }

    /**
     * Calculate distance between two coordinates in meters
     */
    private function calculateDistance(float $lat1, float $lon1, float $lat2, float $lon2): float
    {
        $earthRadius = 6371000; // Earth radius in meters
        
        $dLat = deg2rad($lat2 - $lat1);
        $dLon = deg2rad($lon2 - $lon1);
        
        $a = sin($dLat/2) * sin($dLat/2) + cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * sin($dLon/2) * sin($dLon/2);
        $c = 2 * atan2(sqrt($a), sqrt(1-$a));
        
        return $earthRadius * $c;
    }

    /**
     * Calculate attendance summary for a user
     */
    private function calculateAttendanceSummary($records): array
    {
        $workDays = $records->groupBy(function($record) {
            return Carbon::parse($record->check_clock_time)->format('Y-m-d');
        });

        $totalDays = $workDays->count();
        $onTimeDays = 0;
        $lateDays = 0;
        $absentDays = 0;
        $totalWorkMinutes = 0;

        foreach ($workDays as $date => $dayRecords) {
            $clockIn = $dayRecords->where('check_clock_type', 'clock_in')->first();
            $clockOut = $dayRecords->where('check_clock_type', 'clock_out')->first();

            if ($clockIn && $clockOut) {
                $status = $this->getAttendanceStatus($clockIn, $clockOut);
                if ($status === 'On Time') {
                    $onTimeDays++;
                } else {
                    $lateDays++;
                }

                $workMinutes = Carbon::parse($clockIn->check_clock_time)
                    ->diffInMinutes(Carbon::parse($clockOut->check_clock_time));
                $totalWorkMinutes += $workMinutes;
            } else {
                $absentDays++;
            }
        }

        $user = $records->first()->user;

        return [
            'user' => [
                'id' => $user->id_users,
                'name' => $user->employee->name ?? $user->name,
                'nik' => $user->employee->nik ?? null,
                'email' => $user->email
            ],
            'summary' => [
                'total_days' => $totalDays,
                'on_time_days' => $onTimeDays,
                'late_days' => $lateDays,
                'absent_days' => $absentDays,
                'total_work_hours' => round($totalWorkMinutes / 60, 2),
                'average_work_hours_per_day' => $totalDays > 0 ? round(($totalWorkMinutes / 60) / $totalDays, 2) : 0,
                'attendance_rate' => $totalDays > 0 ? round((($onTimeDays + $lateDays) / $totalDays) * 100, 2) : 0
            ]
        ];
    }
}