"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePlans } from "@/hooks/usePlans";
import { Plan, SeatPlan } from "../types";

export default function PricingPage() {
  const [currentPlanType, setCurrentPlanType] = useState<"package" | "seat">(
    "package"
  );
  const { packagePlans, seatPlans, loading, error, usingApi, refetch } = usePlans();
  const router = useRouter();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-blue-100 to-blue-500 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading pricing plans...</p>
        </div>
      </div>
    );
  }

  const handleToggleChange = (type: "package" | "seat") => {
    setCurrentPlanType(type);
  };  const handlePlanSelect = (
    plan: Plan | SeatPlan,
    planType: "package" | "seat"
  ) => {
    console.log('Plan selected:', plan, 'Type:', planType);
    
    try {
      const planData = {
        id: plan.id,
        name: plan.name,
        type: planType,
        price:
          planType === "package"
            ? (plan as Plan).price
            : { seat: (plan as SeatPlan).pricePerSeat },
        features: plan.features,
      };

      console.log('Storing plan data:', planData);
      
      // Store plan data for the selection pages
      localStorage.setItem("selectedPlan", JSON.stringify(planData));

      // Navigate to appropriate selection page using Next.js router
      if (planType === "package") {
        if (plan.id === "lite") {
          console.log('Navigating to lite plan');
          router.push("/plans/choose-lite");
        } else if (plan.id === "pro") {
          console.log('Navigating to pro plan');
          router.push("/plans/choose-pro");
        } else {
          console.log('Unknown package plan:', plan.id);
        }
      } else {
        // For seat plans, navigate to seat selection pages
        if (plan.id === "standard-seat") {
          router.push("/plans/choose-seats/standard");
        } else if (plan.id === "premium-seat") {
          router.push("/plans/choose-seats/premium");
        } else if (plan.id === "enterprise-seat") {
          router.push("/plans/choose-seats/enterprise");
        } else {
          console.log('Unknown seat plan:', plan.id);
        }
      }
    } catch (error) {
      console.error('Error in handlePlanSelect:', error);
    }
  };

  return (
    <main className="font-inter min-h-screen bg-gradient-to-b from-white via-blue-100 to-blue-500 flex items-center justify-center">
      <section className="py-20 text-center">
        <h2
          className="py-3 text-5xl font-bold mb-10 text-gray-900"
          style={{ textShadow: "1px 1px 3px rgba(0, 0, 0, 0.5)" }}
        >
          HRIS Pricing Plans
        </h2>
        <p className="text-gray-800 mb-10">
          <span className="block">
            Choose the plan that best suits your business!
          </span>
          <span className="block">
            This HRIS offers both subscription and pay-as-you-go payment
            options,
          </span>
          <span className="block">available in the following packages:</span>
        </p>{" "}
        <div className="flex justify-center mt-6 mb-10">
          <div className="relative flex bg-white shadow-md rounded-full overflow-hidden w-80">
            <input
              type="radio"
              name="tab"
              id="package"
              className="hidden"
              checked={currentPlanType === "package"}
              onChange={() => handleToggleChange("package")}
            />
            <input
              type="radio"
              name="tab"
              id="seat"
              className="hidden"
              checked={currentPlanType === "seat"}
              onChange={() => handleToggleChange("seat")}
            />
            <div
              className={`absolute top-0 left-0 h-full w-1/2 bg-[#1D395E] rounded-full transform transition-all duration-300 ${
                currentPlanType === "seat"
                  ? "translate-x-full"
                  : "translate-x-0"
              }`}
            ></div>
            <label
              htmlFor="package"
              className={`relative z-10 w-1/2 py-3 text-sm font-semibold text-center cursor-pointer transition-all ${
                currentPlanType === "package" ? "text-white" : "text-gray-700"
              }`}
            >
              Package
            </label>
            <label
              htmlFor="seat"
              className={`relative z-10 w-1/2 py-3 text-sm font-semibold text-center cursor-pointer transition-all ${
                currentPlanType === "seat" ? "text-white" : "text-gray-700"
              }`}
            >
              Seat
            </label>
          </div>
        </div>{" "}        <div className="min-h-[600px]">
          {error && (
            <div className="text-center mb-4">
              <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg inline-block">
                <div className="flex items-center space-x-2">
                  <span>⚠️ {error}</span>
                  <button 
                    onClick={refetch}
                    className="ml-2 px-2 py-1 bg-yellow-200 hover:bg-yellow-300 rounded text-xs"
                  >
                    Retry API
                  </button>
                </div>
              </div>
            </div>          )}
          
          {/* Package Plans */}
          <div
            className={`grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6 transition-all duration-300 ${
              currentPlanType === "package" ? "block" : "hidden"
            }`}
          >            {packagePlans.map((plan: Plan) => {
              const getCardStyles = () => {
                if (plan.id === "starter")
                  return "bg-gradient-to-l from-[#4A90E2] to-[#357ABD] text-white";
                if (plan.id === "lite") 
                  return "bg-[#2E2E3A] text-white";
                return "bg-gradient-to-l from-[#7CA5BF] to-[#3A4D59] text-white";
              };

              const getButtonStyles = () => {
                if (plan.id === "starter")
                  return "bg-[#2D8DFE] text-white hover:bg-[#2278D2]";
                return "bg-white text-blue-500 hover:bg-gray-100";
              };return (
                <div
                  key={plan.id}
                  className={`${getCardStyles()} rounded-xl shadow-lg p-8 transform hover:scale-105 transition-all duration-300`}
                >
                  <h3 className="text-2xl font-semibold text-left">
                    {plan.name}
                    {plan.recommended && (
                      <span className="text-sm"> (Recommended)</span>
                    )}
                  </h3>{" "}
                  <p className="text-4xl font-bold text-left">
                    {plan.id === "starter"
                      ? "Free"
                      : `Rp ${plan.price.yearly.toLocaleString("id-ID")}`}
                    {plan.id !== "starter" && (
                      <span className="text-lg">/year</span>
                    )}
                  </p>
                  <hr className="border-t-2 border-white my-4" />{" "}
                  <ul className="mt-6 text-sm text-left list-disc list-inside space-y-2">
                    {plan.features
                      .slice(0, 6)
                      .map((feature: any, index: number) => (
                        <li key={index}>{feature.name}</li>
                      ))}
                  </ul>                  {plan.id === "starter" ? (
                    <button
                      className={`mt-6 w-full ${getButtonStyles()} font-bold py-3 rounded-lg transition-all duration-200`}
                    >
                      Current Plan
                    </button>
                  ) : (
                    <button
                      onClick={() => handlePlanSelect(plan, "package")}
                      className={`mt-6 w-full ${getButtonStyles()} font-bold py-3 rounded-lg transition-all duration-200`}
                    >
                      {plan.buttonText}
                    </button>
                  )}
                </div>
              );            })}
          </div>
          
          {/* Seat Plans */}
          <div
            className={`grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6 transition-all duration-300 ${
              currentPlanType === "seat" ? "block" : "hidden"
            }`}
          >            {seatPlans.map((plan: SeatPlan, index: number) => {
              const getCardStyles = () => {
                if (index === 0)
                  return "bg-gradient-to-l from-[#4A90E2] to-[#357ABD] text-white";
                if (index === 1) 
                  return "bg-[#2E2E3A] text-white";
                return "bg-gradient-to-l from-[#7CA5BF] to-[#3A4D59] text-white";
              };              return (
                <div
                  key={plan.id}
                  className={`${getCardStyles()} rounded-xl shadow-lg p-8 transform hover:scale-105 transition-all duration-300`}
                >
                  <h3 className="text-2xl font-semibold text-left">
                    {plan.name}
                  </h3>{" "}
                  <p className="text-4xl font-bold text-left">
                    Rp {plan.pricePerSeat.toLocaleString("id-ID")}{" "}
                    <span className="text-lg">/seat</span>
                  </p>
                  <hr className="border-t-2 border-white my-4" />{" "}
                  <ul className="mt-6 text-sm text-left list-disc list-inside space-y-2">
                    {plan.features
                      .slice(0, 3)
                      .map((feature: any, index: number) => (
                        <li key={index}>{feature.name}</li>
                      ))}
                  </ul>                  <button
                    onClick={() => handlePlanSelect(plan, "seat")}
                    className="mt-6 w-full bg-white text-blue-500 hover:bg-gray-100 font-bold py-3 rounded-lg transition-all duration-200"
                  >
                    {plan.buttonText}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
