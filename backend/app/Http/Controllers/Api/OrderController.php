<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class OrderController extends Controller
{
    /**
     * Display a listing of user orders.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        
        $query = Order::with(['plan', 'paymentMethod', 'user'])
            ->where('user_id', $user->id_users);

        // Filter by status if provided
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by date range if provided
        if ($request->has('date_from') && $request->has('date_to')) {
            $query->whereBetween('created_at', [
                $request->date_from,
                $request->date_to
            ]);
        }

        $orders = $query->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'message' => 'Orders retrieved successfully',
            'data' => $orders->items(),
            'pagination' => [
                'current_page' => $orders->currentPage(),
                'last_page' => $orders->lastPage(),
                'per_page' => $orders->perPage(),
                'total' => $orders->total(),
                'from' => $orders->firstItem(),
                'to' => $orders->lastItem(),
            ]
        ], 200);
    }

    /**
     * Store a newly created order.
     */
    public function store(Request $request): JsonResponse
    {
        // Orders are typically created through the payment processing flow
        // This endpoint might not be needed for direct order creation
        return response()->json([
            'success' => false,
            'message' => 'Orders are created automatically during payment processing'
        ], 400);
    }

    /**
     * Display the specified order.
     */
    public function show(Request $request, string $id): JsonResponse
    {
        $user = $request->user();
        
        $order = Order::with(['plan', 'paymentMethod', 'user'])
            ->where('user_id', $user->id_users)
            ->where('order_id', $id)
            ->firstOrFail();

        return response()->json([
            'success' => true,
            'message' => 'Order retrieved successfully',
            'data' => [
                'id' => $order->id,
                'order_id' => $order->order_id,
                'plan' => [
                    'id' => $order->plan->id,
                    'name' => $order->plan->name,
                    'type' => $order->plan->type,
                    'description' => $order->plan->description,
                ],
                'payment_method' => [
                    'id' => $order->paymentMethod->id,
                    'name' => $order->paymentMethod->name,
                    'type' => $order->paymentMethod->type,
                ],
                'billing_period' => $order->billing_period,
                'quantity' => $order->quantity,
                'unit_price' => $order->unit_price,
                'subtotal' => $order->subtotal,
                'tax_amount' => $order->tax_amount,
                'processing_fee' => $order->processing_fee,
                'total_amount' => $order->total_amount,
                'currency' => $order->currency,
                'billing_info' => $order->billing_info,
                'status' => $order->status,
                'processed_at' => $order->processed_at?->format('Y-m-d H:i:s'),
                'created_at' => $order->created_at->format('Y-m-d H:i:s'),
                'updated_at' => $order->updated_at->format('Y-m-d H:i:s'),
            ]
        ], 200);
    }

    /**
     * Update the specified order.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        // Orders should generally not be updatable after creation
        // Only specific status updates might be allowed by admins
        return response()->json([
            'success' => false,
            'message' => 'Orders cannot be modified after creation'
        ], 400);
    }

    /**
     * Remove the specified order.
     */
    public function destroy(string $id): JsonResponse
    {
        // Orders should not be deletable for audit purposes
        return response()->json([
            'success' => false,
            'message' => 'Orders cannot be deleted for audit purposes'
        ], 400);
    }

    /**
     * Get order statistics for the current user.
     */
    public function statistics(Request $request): JsonResponse
    {
        $user = $request->user();
        
        $totalOrders = Order::where('user_id', $user->id_users)->count();
        $completedOrders = Order::where('user_id', $user->id_users)
            ->where('status', 'completed')->count();
        $pendingOrders = Order::where('user_id', $user->id_users)
            ->where('status', 'pending')->count();
        $failedOrders = Order::where('user_id', $user->id_users)
            ->where('status', 'failed')->count();
        
        $totalSpent = Order::where('user_id', $user->id_users)
            ->where('status', 'completed')
            ->sum('total_amount');

        $recentOrders = Order::with(['plan', 'paymentMethod'])
            ->where('user_id', $user->id_users)
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Order statistics retrieved successfully',
            'data' => [
                'summary' => [
                    'total_orders' => $totalOrders,
                    'completed_orders' => $completedOrders,
                    'pending_orders' => $pendingOrders,
                    'failed_orders' => $failedOrders,
                    'total_spent' => $totalSpent,
                ],
                'recent_orders' => $recentOrders->map(function($order) {
                    return [
                        'order_id' => $order->order_id,
                        'plan_name' => $order->plan->name,
                        'total_amount' => $order->total_amount,
                        'status' => $order->status,
                        'created_at' => $order->created_at->format('Y-m-d H:i:s'),
                    ];
                })
            ]
        ], 200);
    }
}
