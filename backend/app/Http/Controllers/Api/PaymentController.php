<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PaymentMethod;
use App\Models\Order;
use App\Models\Plan;
use App\Models\Subscription;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class PaymentController extends Controller
{
    /**
     * Display a listing of payment methods.
     */
    public function index(): JsonResponse
    {
        $paymentMethods = PaymentMethod::where('is_active', true)->get();
        
        $grouped = [
            'cards' => $paymentMethods->where('type', 'card')->values(),
            'banks' => $paymentMethods->where('type', 'bank')->values(),
            'digital_wallets' => $paymentMethods->where('type', 'digital_wallet')->values(),
        ];

        return response()->json([
            'success' => true,
            'data' => $grouped
        ]);
    }

    /**
     * Process a payment for a plan.
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'plan_id' => 'required|exists:plans,id',
            'payment_method_id' => 'required|exists:payment_methods,id',
            'billing_period' => 'nullable|in:monthly,yearly',
            'quantity' => 'required|integer|min:1',
            'billing_info' => 'required|array',
            'billing_info.firstName' => 'required|string',
            'billing_info.lastName' => 'required|string',
            'billing_info.email' => 'required|email',
            'billing_info.phone' => 'required|string',
            'billing_info.address' => 'required|string',
            'billing_info.city' => 'required|string',
            'billing_info.state' => 'required|string',
            'billing_info.zipCode' => 'required|string',
            'billing_info.country' => 'required|string',
        ]);

        try {
            DB::beginTransaction();

            $plan = Plan::findOrFail($request->plan_id);
            $paymentMethod = PaymentMethod::findOrFail($request->payment_method_id);
            
            // Calculate pricing
            $unitPrice = $plan->getPrice($request->billing_period ?? 'monthly');
            $subtotal = $unitPrice * $request->quantity;
            $taxAmount = round($subtotal * 0.11); // 11% tax
            $processingFee = $paymentMethod->processing_fee ?? 0;
            $totalAmount = $subtotal + $taxAmount + $processingFee;

            // Create order
            $order = Order::create([
                'order_id' => Order::generateOrderId(),
                'user_id' => Auth::id() ?? 1, // For now, use user 1 if not authenticated
                'plan_id' => $plan->id,
                'payment_method_id' => $paymentMethod->id,
                'billing_period' => $request->billing_period,
                'quantity' => $request->quantity,
                'unit_price' => $unitPrice,
                'subtotal' => $subtotal,
                'tax_amount' => $taxAmount,
                'processing_fee' => $processingFee,
                'total_amount' => $totalAmount,
                'currency' => $plan->currency,
                'billing_info' => $request->billing_info,
                'status' => 'pending',
            ]);

            // Simulate payment processing (90% success rate)
            $paymentSuccess = rand(1, 10) <= 9;

            if ($paymentSuccess) {
                $order->markAsCompleted();

                // Create subscription for both package and seat plans
                $startsAt = now();
                
                // Determine billing period duration
                if ($plan->isPackagePlan() && $request->billing_period === 'yearly') {
                    $endsAt = (clone $startsAt)->addYear();
                } else {
                    // Monthly billing for both package monthly and all seat plans
                    $endsAt = (clone $startsAt)->addMonth();
                }

                // Set billing period based on plan type
                $billingPeriod = $plan->isSeatPlan() ? 'monthly' : $request->billing_period;

                Subscription::create([
                    'user_id' => $order->user_id,
                    'plan_id' => $plan->id,
                    'billing_period' => $billingPeriod,
                    'quantity' => $request->quantity,
                    'unit_price' => $unitPrice,
                    'total_price' => $totalAmount,
                    'currency' => $plan->currency,
                    'status' => 'active',
                    'starts_at' => $startsAt,
                    'ends_at' => $endsAt,
                ]);

                DB::commit();

                return response()->json([
                    'success' => true,
                    'message' => 'Payment processed successfully',
                    'data' => [
                        'order_id' => $order->order_id,
                        'total_amount' => $totalAmount,
                        'currency' => $plan->currency,
                        'status' => 'completed'
                    ]
                ]);
            } else {
                $order->markAsFailed();
                DB::commit();

                return response()->json([
                    'success' => false,
                    'message' => 'Payment processing failed',
                    'data' => [
                        'order_id' => $order->order_id,
                        'status' => 'failed'
                    ]
                ], 400);
            }

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Payment processing error: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get order details
     */
    public function show(string $orderId): JsonResponse
    {
        $order = Order::where('order_id', $orderId)
            ->with(['plan', 'paymentMethod'])
            ->firstOrFail();

        return response()->json([
            'success' => true,
            'data' => $order
        ]);
    }

    /**
     * Calculate pricing for a plan
     */
    public function calculate(Request $request): JsonResponse
    {
        $request->validate([
            'plan_id' => 'required|exists:plans,id',
            'billing_period' => 'nullable|in:monthly,yearly',
            'quantity' => 'required|integer|min:1',
            'payment_method_id' => 'nullable|exists:payment_methods,id',
        ]);

        $plan = Plan::findOrFail($request->plan_id);
        $unitPrice = $plan->getPrice($request->billing_period ?? 'monthly');
        $subtotal = $unitPrice * $request->quantity;
        $taxAmount = round($subtotal * 0.11); // 11% tax
        
        $processingFee = 0;
        if ($request->payment_method_id) {
            $paymentMethod = PaymentMethod::find($request->payment_method_id);
            $processingFee = $paymentMethod->processing_fee ?? 0;
        }
        
        $totalAmount = $subtotal + $taxAmount + $processingFee;

        return response()->json([
            'success' => true,
            'data' => [
                'unit_price' => $unitPrice,
                'quantity' => $request->quantity,
                'subtotal' => $subtotal,
                'tax_amount' => $taxAmount,
                'processing_fee' => $processingFee,
                'total_amount' => $totalAmount,
                'currency' => $plan->currency,
            ]
        ]);
    }

    // ...existing methods for update and destroy if needed
    public function update(Request $request, string $id) {}
    public function destroy(string $id) {}
}
