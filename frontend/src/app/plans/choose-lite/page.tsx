// src/app/choose-package/page.tsx

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { PACKAGE_PLANS } from '../config';
import { Plan, CartItem } from '../types';

export default function ChoosePackagePage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('yearly');
  const [employeeCount, setEmployeeCount] = useState(2);
  const [teamSize, setTeamSize] = useState("1 - 50");
  const [plan, setPlan] = useState<Plan | null>(null);

  useEffect(() => {
    // Load plan data
    const savedPlan = localStorage.getItem('selectedPlan');
    if (savedPlan) {
      setPlan(JSON.parse(savedPlan));
    } else {
      // Fallback to Lite plan from config
      const litePlan = PACKAGE_PLANS.find((p: any) => p.id === 'lite');
      if (litePlan) setPlan(litePlan);
    }
  }, []);

  useEffect(() => {
    const defaultCount = parseInt(teamSize.split("-")[0].trim());
    setEmployeeCount(defaultCount);
  }, [teamSize]);

  const getCurrentPrice = () => {
    if (!plan) return 0;
    return billingPeriod === 'yearly' ? plan.price.yearly : plan.price.monthly;
  };

  const subtotal = getCurrentPrice() * employeeCount;
  const tax = Math.round(subtotal * 0.11); // 11% VAT
  const total = subtotal + tax;

  const handleConfirmUpgrade = () => {
    if (!plan) return;

    const cartItem: CartItem = {
      planId: plan.id,
      planName: plan.name,
      planType: 'package',
      billingPeriod: billingPeriod,
      quantity: employeeCount,
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

            <h1 className="text-3xl font-bold mb-1">Choosing Package</h1>
            <p className="text-gray-500 mb-1">Upgrade to Lite</p>
            <Link href="/plans/pricing-plans" className="text-sm text-blue-600 underline inline-block mb-6">
              Change Plan
            </Link>            {/* Billing Period */}
            <h2 className="font-semibold mb-2">Billing Period</h2>            <div className="flex space-x-4 mb-6 flex-wrap">
              <button
                onClick={() => setBillingPeriod('yearly')}
                className={`billing-btn px-4 py-2 rounded transition w-full sm:w-auto mb-2 sm:mb-0 text-white ${
                  billingPeriod === 'yearly' ? "bg-blue-700" : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                Yearly - Rp {plan?.price.yearly?.toLocaleString('id-ID') || '20.000'} / User
              </button>
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={`billing-btn px-4 py-2 rounded transition w-full sm:w-auto text-white ${
                  billingPeriod === 'monthly' ? "bg-blue-700" : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                Monthly - Rp {plan?.price.monthly?.toLocaleString('id-ID') || '25.000'} / User
              </button>
            </div>

            {/* Team Size */}
            <h2 className="font-semibold mb-2">Size Matters</h2>
            <p className="text-gray-600 mb-2">Choose the right fit for your team!</p>
            <div className="flex items-center space-x-6 mb-6">
              {["1 - 50", "51 - 100"].map((size) => (
                <label key={size} className="inline-flex items-center">
                  <input
                    type="radio"
                    name="team_size"
                    className="form-radio text-blue-500"
                    checked={teamSize === size}
                    onChange={() => setTeamSize(size)}
                  />
                  <span className="ml-2">{size}</span>
                </label>
              ))}
            </div>            {/* Employee Count */}
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="font-semibold">Number of Employees</h2>
                <p className="text-xs text-gray-500 mt-1">
                  Minimum: {parseInt(teamSize.split("-")[0].trim())} employees
                </p>
              </div>
              <div className="flex items-center">
                <input
                  type="number"
                  value={employeeCount === 0 ? '' : employeeCount}                  onChange={(e) => {
                    const value = e.target.value === '' ? 0 : parseInt(e.target.value);
                    const minEmployees = parseInt(teamSize.split("-")[0].trim());
                    const maxEmployees = 9999999; // 7 digits max
                    
                    // Allow typing but enforce maximum
                    if (value >= 0 && value <= maxEmployees) {
                      setEmployeeCount(value);
                    }
                  }}                  onBlur={(e) => {
                    // Enforce minimum and maximum value on blur
                    const value = parseInt(e.target.value) || 0;
                    const minEmployees = parseInt(teamSize.split("-")[0].trim());
                    const maxEmployees = 9999999; // 7 digits max
                    
                    if (value < minEmployees) {
                      setEmployeeCount(minEmployees);
                    } else if (value > maxEmployees) {
                      setEmployeeCount(maxEmployees);
                    }
                  }}                  min={parseInt(teamSize.split("-")[0].trim())}
                  max={9999999}
                  className="w-24 px-3 py-2 border border-gray-300 rounded-md text-center text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder={parseInt(teamSize.split("-")[0].trim()).toString()}
                />
                <span className="ml-2 text-sm text-gray-500">employees</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="bg-gray-100 p-8 rounded-lg shadow mt-8 sm:mt-0 flex flex-col justify-between flex-grow">
          <h2 className="text-2xl font-bold mb-6">Order Summary</h2>          <div className="text-sm space-y-2">
            <div className="grid grid-cols-3 gap-x-2">
              <span>Package</span>
              <span className="text-center">:</span>
              <span>{plan?.name || 'Lite'}</span>
            </div>
            <div className="grid grid-cols-3 gap-x-2">
              <span>Billing Period</span>
              <span className="text-center">:</span>
              <span>{billingPeriod.charAt(0).toUpperCase() + billingPeriod.slice(1)}</span>
            </div>
            <div className="grid grid-cols-3 gap-x-2">
              <span>Team Size</span>
              <span className="text-center">:</span>
              <span>{teamSize}</span>
            </div>
            <div className="grid grid-cols-3 gap-x-2">
              <span>Number of Employees</span>
              <span className="text-center">:</span>
              <span>{employeeCount}</span>
            </div>            <div className="grid grid-cols-3 gap-x-2">
              <span>Price per User</span>
              <span className="text-center">:</span>
              <span>Rp {getCurrentPrice().toLocaleString('id-ID')}</span>
            </div>
          </div>

          <hr className="my-6 border-black" />          <div className="text-sm space-y-2">
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
            onClick={handleConfirmUpgrade}
            className="w-full bg-blue-900 text-white py-3 rounded hover:bg-blue-800 font-semibold"
          >
            Confirm and upgrade
          </button>
        </div>
      </div>
    </main>
  );
}
