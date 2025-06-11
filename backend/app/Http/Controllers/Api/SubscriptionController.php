<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Subscription;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class SubscriptionController extends Controller
{
    /**
     * Display a listing of user subscriptions.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        
        $subscriptions = Subscription::with(['plan', 'user'])
            ->where('user_id', $user->id_users)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Subscriptions retrieved successfully',
            'data' => $subscriptions->map(function($subscription) {
                return [
                    'id' => $subscription->id,
                    'plan' => [
                        'id' => $subscription->plan->id,
                        'name' => $subscription->plan->name,
                        'type' => $subscription->plan->type,
                    ],
                    'billing_period' => $subscription->billing_period,
                    'quantity' => $subscription->quantity,
                    'unit_price' => $subscription->unit_price,
                    'total_price' => $subscription->total_price,
                    'currency' => $subscription->currency,
                    'status' => $subscription->status,
                    'starts_at' => $subscription->starts_at->format('Y-m-d'),
                    'ends_at' => $subscription->ends_at->format('Y-m-d'),
                    'days_remaining' => $subscription->daysRemaining(),
                    'is_active' => $subscription->isActive(),
                    'is_expired' => $subscription->isExpired(),
                    'created_at' => $subscription->created_at->format('Y-m-d H:i:s'),
                ];
            })
        ], 200);
    }

    /**
     * Store a newly created subscription.
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'plan_id' => 'required|exists:plans,id',
            'billing_period' => 'required|in:monthly,yearly',
            'quantity' => 'required|integer|min:1',
        ]);

        // This endpoint might not be needed since subscriptions are created
        // automatically during payment processing
        return response()->json([
            'success' => false,
            'message' => 'Subscriptions are created automatically during payment processing'
        ], 400);
    }

    /**
     * Display the specified subscription.
     */
    public function show(Request $request, string $id): JsonResponse
    {
        $user = $request->user();
        
        $subscription = Subscription::with(['plan', 'user'])
            ->where('user_id', $user->id_users)
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'message' => 'Subscription retrieved successfully',
            'data' => [
                'id' => $subscription->id,
                'plan' => [
                    'id' => $subscription->plan->id,
                    'name' => $subscription->plan->name,
                    'type' => $subscription->plan->type,
                    'description' => $subscription->plan->description,
                ],
                'billing_period' => $subscription->billing_period,
                'quantity' => $subscription->quantity,
                'unit_price' => $subscription->unit_price,
                'total_price' => $subscription->total_price,
                'currency' => $subscription->currency,
                'status' => $subscription->status,
                'starts_at' => $subscription->starts_at->format('Y-m-d H:i:s'),
                'ends_at' => $subscription->ends_at->format('Y-m-d H:i:s'),
                'cancelled_at' => $subscription->cancelled_at?->format('Y-m-d H:i:s'),
                'days_remaining' => $subscription->daysRemaining(),
                'is_active' => $subscription->isActive(),
                'is_expired' => $subscription->isExpired(),
                'is_cancelled' => $subscription->isCancelled(),
                'created_at' => $subscription->created_at->format('Y-m-d H:i:s'),
            ]
        ], 200);
    }

    /**
     * Update the specified subscription.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $user = $request->user();
        
        $subscription = Subscription::where('user_id', $user->id_users)
            ->findOrFail($id);

        $request->validate([
            'quantity' => 'sometimes|integer|min:1',
        ]);

        // Only allow updating quantity for active subscriptions
        if (!$subscription->isActive()) {
            return response()->json([
                'success' => false,
                'message' => 'Only active subscriptions can be modified'
            ], 400);
        }

        if ($request->has('quantity')) {
            $newTotal = $subscription->unit_price * $request->quantity;
            
            $subscription->update([
                'quantity' => $request->quantity,
                'total_price' => $newTotal,
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Subscription updated successfully',
            'data' => $subscription->fresh()
        ], 200);
    }

    /**
     * Cancel the specified subscription.
     */
    public function cancel(Request $request, string $id): JsonResponse
    {
        $user = $request->user();
        
        $subscription = Subscription::where('user_id', $user->id_users)
            ->findOrFail($id);

        if ($subscription->isCancelled()) {
            return response()->json([
                'success' => false,
                'message' => 'Subscription is already cancelled'
            ], 400);
        }

        $subscription->cancel();

        return response()->json([
            'success' => true,
            'message' => 'Subscription cancelled successfully',
            'data' => $subscription->fresh()
        ], 200);
    }
}
