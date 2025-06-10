<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\CheckClockSetting;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class CheckClockSettingController extends Controller
{
    /**
     * Get all check clock settings
     */
    public function index(Request $request): JsonResponse
    {
        $query = CheckClockSetting::with('settingTimes');

        // Search by name
        if ($request->has('search') && $request->search) {
            $query->byName($request->search);
        }

        // Filter by type
        if ($request->has('type') && $request->type) {
            $query->byType($request->type);
        }

        $perPage = $request->get('per_page', 10);
        $settings = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'message' => 'Check clock settings retrieved successfully',
            'data' => [
                'settings' => $settings->items(),
                'pagination' => [
                    'current_page' => $settings->currentPage(),
                    'last_page' => $settings->lastPage(),
                    'per_page' => $settings->perPage(),
                    'total' => $settings->total(),
                ]
            ]
        ], 200);
    }

    /**
     * Store new check clock setting
     */
    public function store(Request $request): JsonResponse
    {
        // Check if user is admin or super admin
        if (!$request->user()->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Only admin or super admin can create settings'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'type' => 'required|string|max:100',
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $setting = CheckClockSetting::create([
                'name' => $request->name,
                'type' => $request->type,
                'geo_loc' => $request->latitude . ',' . $request->longitude,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Check clock setting created successfully',
                'data' => [
                    'setting' => [
                        'id' => $setting->id,
                        'name' => $setting->name,
                        'type' => $setting->type,
                        'geo_location' => $setting->geo_location,
                    ]
                ]
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create setting',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Show specific setting
     */
    public function show(int $id): JsonResponse
    {
        $setting = CheckClockSetting::with('settingTimes')->find($id);

        if (!$setting) {
            return response()->json([
                'success' => false,
                'message' => 'Setting not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Setting retrieved successfully',
            'data' => [
                'setting' => [
                    'id' => $setting->id,
                    'name' => $setting->name,
                    'type' => $setting->type,
                    'geo_location' => $setting->geo_location,
                    'setting_times' => $setting->settingTimes,
                    'created_at' => $setting->created_at,
                    'updated_at' => $setting->updated_at,
                ]
            ]
        ], 200);
    }

    /**
     * Update setting
     */
    public function update(Request $request, int $id): JsonResponse
    {
        // Check if user is admin or super admin
        if (!$request->user()->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Only admin or super admin can update settings'
            ], 403);
        }

        $setting = CheckClockSetting::find($id);

        if (!$setting) {
            return response()->json([
                'success' => false,
                'message' => 'Setting not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'type' => 'sometimes|string|max:100',
            'latitude' => 'sometimes|numeric|between:-90,90',
            'longitude' => 'sometimes|numeric|between:-180,180',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $updateData = $request->only(['name', 'type']);
            
            if ($request->has('latitude') && $request->has('longitude')) {
                $updateData['geo_loc'] = $request->latitude . ',' . $request->longitude;
            }

            $setting->update($updateData);

            return response()->json([
                'success' => true,
                'message' => 'Setting updated successfully',
                'data' => [
                    'setting' => [
                        'id' => $setting->id,
                        'name' => $setting->name,
                        'type' => $setting->type,
                        'geo_location' => $setting->geo_location,
                    ]
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update setting',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete setting
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        // Check if user is super admin
        if (!$request->user()->isSuperAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Only super admin can delete settings'
            ], 403);
        }

        $setting = CheckClockSetting::find($id);

        if (!$setting) {
            return response()->json([
                'success' => false,
                'message' => 'Setting not found'
            ], 404);
        }

        try {
            $setting->delete();

            return response()->json([
                'success' => true,
                'message' => 'Setting deleted successfully'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete setting',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}