"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { SEAT_PLANS, TAX_RATE } from '../../config';
import { SeatPlan, CartItem } from '../../types';

export default function ChooseStandardSeats() {
  const [seatCount, setSeatCount] = useState(1);
  const [plan, setPlan] = useState<SeatPlan | null>(null);

  useEffect(() => {
    // Load Standard seat plan from config
    const standardPlan = SEAT_PLANS.find((p: any) => p.id === 'standard-seat');
    if (standardPlan) setPlan(standardPlan);
  }, []);

  const getCurrentPrice = () => {
    if (!plan) return 0;
    return plan.pricePerSeat;
  };

  const subtotal = getCurrentPrice() * seatCount;
  const tax = Math.round(subtotal * TAX_RATE); // 11% VAT
  const total = subtotal + tax;

  const handleConfirmPurchase = () => {
    if (!plan) return;

    const cartItem: CartItem = {
      planId: plan.id,
      planName: plan.name,
      planType: 'seat',
      billingPeriod: 'monthly', // Seats are typically monthly
      quantity: seatCount,
      unitPrice: getCurrentPrice(),
      totalPrice: total
    };

    // Store cart data for payment page
    localStorage.setItem('cartData', JSON.stringify([cartItem]));
    
    // Navigate to payment
    window.location.href = '/plans/payment';
  };

  return (
    <main className="bg-white text-gray-900 font-inter min-h-screen flex flex-col">
      <div className="max-w-7xl mx-auto px-4 py-12 flex-grow grid grid-cols-1 sm:grid-cols-2 gap-10">
        {/* Left Section */}
        <div className="flex flex-col justify-between">
          <div>
            <Image src="/img/logo.png" alt="Logo" width={32} height={32} className="mb-4" />

            <h1 className="text-3xl font-bold mb-1">Select Seats</h1>
            <p className="text-gray-500 mb-1">Standard Seat Plan</p>
            <Link href="/plans/pricing-plans" className="text-sm text-blue-600 underline inline-block mb-6">
              Change Plan
            </Link>

            {/* Plan Description */}
            <div className="mb-6">
              <h2 className="font-semibold mb-2">Plan Details</h2>
              <p className="text-gray-600 mb-4">{plan?.description || 'Basic access for individual team members'}</p>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">What's included:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  {plan?.features.slice(0, 5).map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <span className="w-4 h-4 bg-blue-200 rounded-full flex items-center justify-center mr-2 text-xs">✓</span>
                      {feature.name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Seat Count */}
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="font-semibold">Number of Seats</h2>
                <p className="text-xs text-gray-500 mt-1">
                  Minimum: {plan?.minSeats || 1} seats
                </p>
              </div>
              <div className="flex items-center">
                <input
                  type="number"
                  value={seatCount === 0 ? '' : seatCount}
                  onChange={(e) => {
                    const value = e.target.value === '' ? 0 : parseInt(e.target.value);
                    const minSeats = plan?.minSeats || 1;
                    const maxSeats = 9999999; // 7 digits max
                    
                    // Allow typing but enforce limits
                    if (value >= 0 && value <= maxSeats) {
                      setSeatCount(value);
                    }
                  }}
                  onBlur={(e) => {
                    // Enforce minimum and maximum value on blur
                    const value = parseInt(e.target.value) || 0;
                    const minSeats = plan?.minSeats || 1;
                    const maxSeats = 9999999; // 7 digits max
                    
                    if (value < minSeats) {
                      setSeatCount(minSeats);
                    } else if (value > maxSeats) {
                      setSeatCount(maxSeats);
                    }
                  }}
                  min={plan?.minSeats || 1}
                  max={9999999}
                  className="w-24 px-3 py-2 border border-gray-300 rounded-md text-center text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder={(plan?.minSeats || 1).toString()}
                />
                <span className="ml-2 text-sm text-gray-500">seats</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="bg-gray-100 p-8 rounded-lg shadow mt-8 sm:mt-0 flex flex-col justify-between flex-grow">
          <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

          <div className="text-sm space-y-2">
            <div className="grid grid-cols-3 gap-x-2">
              <span>Plan Type</span>
              <span className="text-center">:</span>
              <span>{plan?.name || 'Standard Seat'}</span>
            </div>
            <div className="grid grid-cols-3 gap-x-2">
              <span>Billing Period</span>
              <span className="text-center">:</span>
              <span>Monthly</span>
            </div>
            <div className="grid grid-cols-3 gap-x-2">
              <span>Number of Seats</span>
              <span className="text-center">:</span>
              <span>{seatCount}</span>
            </div>
            <div className="grid grid-cols-3 gap-x-2">
              <span>Price per Seat</span>
              <span className="text-center">:</span>
              <span>Rp {getCurrentPrice().toLocaleString('id-ID')}</span>
            </div>
          </div>

          <hr className="my-6 border-black" />

          <div className="text-sm space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>Rp {subtotal.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (11%)</span>
              <span>Rp {tax.toLocaleString('id-ID')}</span>
            </div>
          </div>

          <hr className="my-6 border-black" />

          <div className="flex justify-between font-bold text-lg mb-6">
            <span>Total</span>
            <span>Rp {total.toLocaleString('id-ID')}</span>
          </div>

          <button 
            onClick={handleConfirmPurchase}
            className="w-full bg-blue-900 text-white py-3 rounded hover:bg-blue-800 font-semibold"
          >
            Confirm and Purchase
          </button>
        </div>
      </div>
    </main>
  );
}
