<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Plan;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PlanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $plans = Plan::where('is_active', true)->get();
        
        $packagePlans = $plans->where('type', 'package')->values();
        $seatPlans = $plans->where('type', 'seat')->values();
        
        return response()->json([
            'success' => true,
            'data' => [
                'package_plans' => $packagePlans,
                'seat_plans' => $seatPlans,
            ]
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'type' => 'required|in:package,seat',
            'monthly_price' => 'nullable|numeric|min:0',
            'yearly_price' => 'nullable|numeric|min:0',
            'seat_price' => 'nullable|numeric|min:0',
            'currency' => 'required|string|max:3',
            'features' => 'required|array',
            'button_text' => 'required|string|max:255',
        ]);

        $plan = Plan::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Plan created successfully',
            'data' => $plan
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        $plan = Plan::findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $plan
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $plan = Plan::findOrFail($id);

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'type' => 'sometimes|in:package,seat',
            'monthly_price' => 'nullable|numeric|min:0',
            'yearly_price' => 'nullable|numeric|min:0',
            'seat_price' => 'nullable|numeric|min:0',
            'currency' => 'sometimes|string|max:3',
            'features' => 'sometimes|array',
            'button_text' => 'sometimes|string|max:255',
        ]);

        $plan->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Plan updated successfully',
            'data' => $plan
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        $plan = Plan::findOrFail($id);
        $plan->update(['is_active' => false]);

        return response()->json([
            'success' => true,
            'message' => 'Plan deactivated successfully'
        ]);
    }
}
