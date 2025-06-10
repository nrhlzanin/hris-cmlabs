<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\CheckClockSettingTime;
use App\Models\CheckClockSetting;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class CheckClockSettingTimeController extends Controller
{
    /**
     * Get all setting times for a specific setting
     */
    public function index(Request $request, int $settingId): JsonResponse
    {
        $setting = CheckClockSetting::find($settingId);

        if (!$setting) {
            return response()->json([
                'success' => false,
                'message' => 'Setting not found'
            ], 404);
        }

        $settingTimes = CheckClockSettingTime::where('ck_settings_id', $settingId)->get();

        return response()->json([
            'success' => true,
            'message' => 'Setting times retrieved successfully',
            'data' => [
                'setting' => [
                    'id' => $setting->id,
                    'name' => $setting->name,
                    'type' => $setting->type,
                ],
                'setting_times' => $settingTimes->map(function ($time) {
                    return [
                        'id' => $time->id,
                        'clock_in' => $time->clock_in,
                        'clock_out' => $time->clock_out,
                        'break_start' => $time->break_start,
                        'break_end' => $time->break_end,
                        'total_work_hours' => $time->total_work_hours,
                        'break_duration' => $time->break_duration,
                    ];
                })
            ]
        ], 200);
    }

    /**
     * Store new setting time
     */
    public function store(Request $request, int $settingId): JsonResponse
    {
        // Check if user is admin or super admin
        if (!$request->user()->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Only admin or super admin can create setting times'
            ], 403);
        }

        $setting = CheckClockSetting::find($settingId);

        if (!$setting) {
            return response()->json([
                'success' => false,
                'message' => 'Setting not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'clock_in' => 'required|date_format:H:i',
            'clock_out' => 'required|date_format:H:i|after:clock_in',
            'break_start' => 'required|date_format:H:i|after:clock_in',
            'break_end' => 'required|date_format:H:i|after:break_start|before:clock_out',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $settingTime = CheckClockSettingTime::create([
                'ck_settings_id' => $settingId,
                'clock_in' => $request->clock_in,
                'clock_out' => $request->clock_out,
                'break_start' => $request->break_start,
                'break_end' => $request->break_end,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Setting time created successfully',
                'data' => [
                    'setting_time' => [
                        'id' => $settingTime->id,
                        'clock_in' => $settingTime->clock_in,
                        'clock_out' => $settingTime->clock_out,
                        'break_start' => $settingTime->break_start,
                        'break_end' => $settingTime->break_end,
                        'total_work_hours' => $settingTime->total_work_hours,
                        'break_duration' => $settingTime->break_duration,
                    ]
                ]
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create setting time',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update setting time
     */
    public function update(Request $request, int $settingId, int $id): JsonResponse
    {
        // Check if user is admin or super admin
        if (!$request->user()->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Only admin or super admin can update setting times'
            ], 403);
        }

        $settingTime = CheckClockSettingTime::where('id', $id)
                                          ->where('ck_settings_id', $settingId)
                                          ->first();

        if (!$settingTime) {
            return response()->json([
                'success' => false,
                'message' => 'Setting time not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'clock_in' => 'sometimes|date_format:H:i',
            'clock_out' => 'sometimes|date_format:H:i',
            'break_start' => 'sometimes|date_format:H:i',
            'break_end' => 'sometimes|date_format:H:i',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $settingTime->update($request->only(['clock_in', 'clock_out', 'break_start', 'break_end']));

            return response()->json([
                'success' => true,
                'message' => 'Setting time updated successfully',
                'data' => [
                    'setting_time' => [
                        'id' => $settingTime->id,
                        'clock_in' => $settingTime->clock_in,
                        'clock_out' => $settingTime->clock_out,
                        'break_start' => $settingTime->break_start,
                        'break_end' => $settingTime->break_end,
                        'total_work_hours' => $settingTime->total_work_hours,
                        'break_duration' => $settingTime->break_duration,
                    ]
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update setting time',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete setting time
     */
    public function destroy(Request $request, int $settingId, int $id): JsonResponse
    {
        // Check if user is super admin
        if (!$request->user()->isSuperAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Only super admin can delete setting times'
            ], 403);
        }

        $settingTime = CheckClockSettingTime::where('id', $id)
                                          ->where('ck_settings_id', $settingId)
                                          ->first();

        if (!$settingTime) {
            return response()->json([
                'success' => false,
                'message' => 'Setting time not found'
            ], 404);
        }

        try {
            $settingTime->delete();

            return response()->json([
                'success' => true,
                'message' => 'Setting time deleted successfully'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete setting time',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}