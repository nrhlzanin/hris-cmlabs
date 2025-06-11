"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AuthLayout from "@/app/components/auth/AuthLayout";

export default function PasswordUpdatedPage() {
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
      imageAlt="Successful password update"
      imagePosition="right"
    >
      <div className="text-center flex flex-col items-center">
        
        <div className="mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-16 h-16"
            viewBox="0 0 48 48"
          >
            <g fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4">
              <path
                fill="#2f88ff"
                stroke="#000"
                d="M24 4L29.2533 7.83204L35.7557 7.81966L37.7533 14.0077L43.0211 17.8197L41 24L43.0211 30.1803L37.7533 33.9923L35.7557 40.1803L29.2533 40.168L24 44L18.7467 40.168L12.2443 40.1803L10.2467 33.9923L4.97887 30.1803L7 24L4.97887 17.8197L10.2467 14.0077L12.2443 7.81966L18.7467 7.83204L24 4Z"
              />
              <path stroke="#fff" d="M17 24L22 29L32 19" />
            </g>
          </svg>
        </div>

        <h1 className="text-3xl sm:text-4xl text-gray-900 font-bold mb-3">
          Your password has been successfully reset
        </h1>
        <p className="text-gray-700 max-w-md mx-auto">
          You can log in with your new password. If you encounter any issues, please contact support!
        </p>
      </div>

      <div className="mt-8">
        <Link
          href="/auth/sign-in"
          className="w-full block bg-green-700 text-white font-bold py-3 rounded-lg shadow-md hover:shadow-lg hover:bg-green-600 transition-all duration-300 text-center"
        >
          Login Now
        </Link>
      </div>
    </AuthLayout>
  );
}