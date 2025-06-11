"use client";

import { useEffect, useState } from "react";
import { FaRegClock } from "react-icons/fa";
import Link from "next/link";
import AuthLayout from "@/app/components/auth/AuthLayout";

export default function LinkExpiredPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <AuthLayout
      imageUrl="/img/auth.jpg"
      imageAlt="Illustration of an expired link notification"
      imagePosition="right"
    >
      <div className="text-center flex flex-col items-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full mb-8">
          <FaRegClock className="w-24 h-24 text-red-500 mb-8" />
        </div>
        <h1 className="text-3xl sm:text-4xl text-gray-600 font-bold mb-3">
          Link Expired
        </h1>
        <p className="text-gray-600 max-w-sm mx-auto">
          The password reset link has expired. Please request a new link to reset your password.
        </p>
      </div>

      <div className="mt-8">
        <Link
          href="/auth/forgot-password"
          className="w-full block bg-yellow-500 text-black font-bold py-3 rounded-lg shadow-md hover:shadow-lg hover:bg-yellow-400 transition-all duration-300 text-center"
        >
          Back to forgot password
        </Link>
      </div>
    </AuthLayout>
  );
}