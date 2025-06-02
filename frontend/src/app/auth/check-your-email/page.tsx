// src/app/check-email/page.tsx

"use client";

import Image from "next/image";
import Link from "next/link";

export default function CheckYourEmailPage() {
  return (
    <div className="flex flex-col md:flex-row-reverse h-screen w-screen overflow-hidden font-inter">
      {/* Right Image Section */}
      <div className="w-full md:w-1/2 h-64 md:h-full relative">
        <Image
          src="/img/Check Email.png"
          alt="HRIS Illustration"
          fill
          className="object-cover"
        />
      </div>

      {/* Left Info Section */}
      <div className="w-full md:w-1/2 h-full overflow-y-auto p-10 flex flex-col justify-center bg-white">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="48"
            viewBox="0 0 256 193"
            className="h-16 w-auto"
          >
            <path
              fill="#4285f4"
              d="M58.182 192.05V93.14L27.507 65.077L0 49.504v125.091c0 9.658 7.825 17.455 17.455 17.455z"
            />
            <path
              fill="#34a853"
              d="M197.818 192.05h40.727c9.659 0 17.455-7.826 17.455-17.455V49.505l-31.156 17.837l-27.026 25.798z"
            />
            <path
              fill="#ea4335"
              d="m58.182 93.14l-4.174-38.647l4.174-36.989L128 69.868l69.818-52.364l4.669 34.992l-4.669 40.644L128 145.504z"
            />
            <path
              fill="#fbbc04"
              d="M197.818 17.504V93.14L256 49.504V26.231c0-21.585-24.64-33.89-41.89-20.945z"
            />
            <path
              fill="#c5221f"
              d="m0 49.504l26.759 20.07L58.182 93.14V17.504L41.89 5.286C24.61-7.66 0 4.646 0 26.23z"
            />
          </svg>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl text-black font-bold mb-2">Check your email</h1>
          <p className="text-black">
            We sent a password reset link to your email (
            <strong>uremail@gmail.com</strong>) which is valid for 24 hours.
            Please check your inbox!
          </p>
        </div>

        <Link href="set-new-password\">
          <button
            type="button"
            className="w-full bg-[#FFD566] hover:bg-[#FFAB00] text-black font-bold py-2 rounded"
          >
            Open Gmail
          </button>
        </Link>

        <p className="text-center text-sm mt-4">
          <Link href="sign-in\" className="text-blue-600 hover:underline">
            ← Back to log in
          </Link>
        </p>
      </div>
    </div>
  );
}
