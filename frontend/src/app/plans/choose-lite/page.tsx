// src/app/choose-package/page.tsx

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function ChoosePackagePage() {
  const [billingPeriod, setBillingPeriod] = useState("Single Payment");
  const [pricePerUser, setPricePerUser] = useState(17000);
  const [employeeCount, setEmployeeCount] = useState(2);
  const [teamSize, setTeamSize] = useState("1 - 50");

  const handleBillingChange = (type: "single" | "monthly") => {
    if (type === "single") {
      setPricePerUser(17000);
      setBillingPeriod("Single Payment");
    } else {
      setPricePerUser(7000);
      setBillingPeriod("Monthly");
    }
  };

  useEffect(() => {
    const defaultCount = parseInt(teamSize.split("-")[0].trim());
    setEmployeeCount(defaultCount);
  }, [teamSize]);

  const subtotal = pricePerUser * employeeCount;

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
            </Link>

            {/* Billing Period */}
            <h2 className="font-semibold mb-2">Billing Period</h2>
            <div className="flex space-x-4 mb-6 flex-wrap">
              <button
                onClick={() => handleBillingChange("single")}
                className={`billing-btn px-4 py-2 rounded transition w-full sm:w-auto mb-2 sm:mb-0 text-white ${
                  billingPeriod === "Single Payment" ? "bg-blue-700" : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                Single Payment - Rp 17.000 / User
              </button>
              <button
                onClick={() => handleBillingChange("monthly")}
                className={`billing-btn px-4 py-2 rounded transition w-full sm:w-auto text-white ${
                  billingPeriod === "Monthly" ? "bg-blue-700" : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                Monthly - Rp 7.000 / User
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
            </div>

            {/* Employee Count */}
            <div className="flex items-center justify-between mb-10">
              <h2 className="font-semibold">Number of Employees</h2>
              <div className="flex items-center">
                <button
                  onClick={() =>
                    setEmployeeCount((prev) => Math.max(prev - 1, parseInt(teamSize.split("-")[0])))
                  }
                  className="bg-gray-200 px-3 py-1 text-lg font-bold rounded w-10 h-10"
                >
                  -
                </button>
                <span className="w-12 text-center mx-2 text-lg font-semibold">{employeeCount}</span>
                <button
                  onClick={() => setEmployeeCount((prev) => prev + 1)}
                  className="bg-gray-200 px-3 py-1 text-lg font-bold rounded w-10 h-10"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="bg-gray-100 p-8 rounded-lg shadow mt-8 sm:mt-0 flex flex-col justify-between flex-grow">
          <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

          <div className="text-sm space-y-2">
            <div className="grid grid-cols-3 gap-x-2">
              <span>Package</span>
              <span className="text-center">:</span>
              <span>Lite</span>
            </div>
            <div className="grid grid-cols-3 gap-x-2">
              <span>Billing Period</span>
              <span className="text-center">:</span>
              <span>{billingPeriod}</span>
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
            </div>
            <div className="grid grid-cols-3 gap-x-2">
              <span>Price per User</span>
              <span className="text-center">:</span>
              <span>Rp {pricePerUser.toLocaleString()}</span>
            </div>
          </div>

          <hr className="my-6 border-black" />

          <div className="text-sm space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>Rp {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>Rp 0</span>
            </div>
          </div>

          <hr className="my-6 border-black" />

          <div className="flex justify-between font-bold text-lg mb-6">
            <span>Total at renewal</span>
            <span>Rp {subtotal.toLocaleString()}</span>
          </div>

          <button className="w-full bg-blue-900 text-white py-3 rounded hover:bg-blue-800 font-semibold">
            Confirm and upgrade
          </button>
        </div>
      </div>
    </main>
  );
}
