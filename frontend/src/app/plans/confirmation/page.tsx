"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CartItem } from "../types";

// Simple SVG icons
const CheckCircleIcon = () => (
  <svg
    className="w-8 h-8 text-green-600"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const DocumentTextIcon = () => (
  <svg
    className="w-5 h-5 mr-2"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

const CreditCardIcon = () => (
  <svg
    className="w-5 h-5 mr-2"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
    />
  </svg>
);

interface OrderData {
  cartItems: CartItem[];
  paymentData: {
    paymentMethod: string;
    billingInfo: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      company?: string;
    };
  };
  orderId: string;
  totalAmount: number;
}

export default function ConfirmationPage() {
  const [orderData, setOrderData] = useState<OrderData | null>(null);

  useEffect(() => {
    // Load order data from localStorage
    const savedOrderData = localStorage.getItem("completedOrder");
    if (savedOrderData) {
      try {
        setOrderData(JSON.parse(savedOrderData));
      } catch (error) {
        console.error("Error parsing order data:", error);
        // Use fallback data
        setFallbackData();
      }
    } else {
      // Use fallback data for testing
      setFallbackData();
    }
  }, []);

  const setFallbackData = () => {
    const mockOrderData: OrderData = {
      cartItems: [{
        planId: 'premium-seat',
        planName: 'Premium Seat',
        planType: 'seat',
        billingPeriod: 'monthly',
        quantity: 5,
        unitPrice: 10000,
        totalPrice: 55500 // 5 * 10000 * 1.11 tax
      }],
      paymentData: {
        paymentMethod: 'Credit Card',
        billingInfo: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '+6281234567890',
          company: 'Test Company'
        }
      },
      orderId: `ORD-${Date.now()}-TEST123`,
      totalAmount: 55500
    };
    setOrderData(mockOrderData);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };

  if (!orderData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-inter">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading confirmation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 font-inter">
      <div className="max-w-3xl mx-auto px-4">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircleIcon />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-600">
            Thank you for upgrading your HRIS plan. Your subscription is now
            active.
          </p>
        </div>

        {/* Order Summary Card */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Order Summary
            </h2>
            <span className="text-sm text-gray-500">
              Order #{orderData.orderId}
            </span>
          </div>

          {/* Items */}
          <div className="space-y-4 mb-6">
            {orderData.cartItems.map((item: CartItem, index: number) => (
              <div key={index} className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{item.planName}</h3>
                  <div className="text-sm text-gray-500 space-y-1">
                    <p>
                      Plan Type:{" "}
                      {item.planType === "package" ? "Package" : "Seat-based"}
                    </p>
                    {item.billingPeriod && (
                      <p>
                        Billing:{" "}
                        {item.billingPeriod.charAt(0).toUpperCase() +
                          item.billingPeriod.slice(1)}
                      </p>
                    )}
                    <p>
                      Quantity: {item.quantity}{" "}
                      {item.planType === "seat" ? "seats" : "users"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">
                    {formatCurrency(Math.round(item.totalPrice / 1.11))}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatCurrency(item.unitPrice)} each
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Payment Details */}
          <div className="border-t pt-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-gray-900">
                {formatCurrency(
                  Math.round(orderData.totalAmount / 1.11)
                )}
              </span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Tax (11%)</span>
              <span className="text-gray-900">
                {formatCurrency(
                  orderData.totalAmount - Math.round(orderData.totalAmount / 1.11)
                )}
              </span>
            </div>
            <div className="flex justify-between font-semibold text-lg pt-2 border-t">
              <span className="text-gray-900">Total Paid</span>
              <span className="text-gray-900">
                {formatCurrency(orderData.totalAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Method Card */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <CreditCardIcon />
            Payment Method
          </h3>
          <div className="flex items-center">
            <div className="w-12 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded flex items-center justify-center mr-3">
              <span className="text-white text-xs font-bold">
                {orderData.paymentData.paymentMethod.slice(0, 3).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="font-medium text-gray-900">
                {orderData.paymentData.paymentMethod}
              </p>
              <p className="text-sm text-gray-500">
                {orderData.paymentData.billingInfo.firstName}{" "}
                {orderData.paymentData.billingInfo.lastName}
              </p>
            </div>
          </div>
        </div>

        {/* Billing Information Card */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <DocumentTextIcon />
            Billing Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Name</p>
              <p className="font-medium text-gray-900">
                {orderData.paymentData.billingInfo.firstName}{" "}
                {orderData.paymentData.billingInfo.lastName}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Email</p>
              <p className="font-medium text-gray-900">
                {orderData.paymentData.billingInfo.email}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Phone</p>
              <p className="font-medium text-gray-900">
                {orderData.paymentData.billingInfo.phone}
              </p>
            </div>
            {orderData.paymentData.billingInfo.company && (
              <div>
                <p className="text-gray-500">Company</p>
                <p className="font-medium text-gray-900">
                  {orderData.paymentData.billingInfo.company}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Next Steps Card */}
        <div className="bg-blue-50 rounded-lg border border-blue-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            What's Next?
          </h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              You'll receive a confirmation email at{" "}
              {orderData.paymentData.billingInfo.email} within 5 minutes
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Your HRIS account will be upgraded immediately and all features
              will be available
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Access your dashboard to start using your new features
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Need help? Contact our support team anytime
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Link
            href="/dashboard"
            className="flex-1 bg-blue-600 text-white text-center py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/plans/pricing-plans"
            className="flex-1 border border-gray-300 text-gray-700 text-center py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            View All Plans
          </Link>
        </div>

        {/* Footer Links */}
        <div className="text-center">
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
            <Link href="/invoice" className="text-blue-600 hover:text-blue-700">
              Download Invoice
            </Link>
            <span className="hidden sm:inline text-gray-400">|</span>
            <Link href="/support" className="text-blue-600 hover:text-blue-700">
              Help Center
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
