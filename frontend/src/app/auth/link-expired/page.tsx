// src/app/link-expired/page.tsx

"use client";

import Image from "next/image";
import Link from "next/link";

export default function LinkExpiredPage() {
  return (
    <div className="flex flex-col md:flex-row h-screen w-screen overflow-hidden font-inter">
      {/* Left Content */}
      <div className="w-full md:w-1/2 h-full overflow-y-auto p-10 flex flex-col justify-center bg-white">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            viewBox="0 0 48 48"
            className="h-16 w-16"
          >
            <circle cx="17" cy="17" r="14" fill="#00acc1" />
            <circle cx="17" cy="17" r="11" fill="#eee" />
            <path d="M16 8h2v9h-2z" />
            <path d="m22.655 20.954l-1.697 1.697l-4.808-4.807l1.697-1.697z" />
            <circle cx="17" cy="17" r="2" />
            <circle cx="17" cy="17" r="1" fill="#00acc1" />
            <path
              fill="#ffc107"
              d="m11.9 42l14.4-24.1c.8-1.3 2.7-1.3 3.4 0L44.1 42c.8 1.3-.2 3-1.7 3H13.6c-1.5 0-2.5-1.7-1.7-3"
            />
            <path
              fill="#263238"
              d="M26.4 39.9c0-.2 0-.4.1-.6s.2-.3.3-.5s.3-.2.5-.3s.4-.1.6-.1s.5 0 .7.1s.4.2.5.3s.2.3.3.5s.1.4.1.6s0 .4-.1.6s-.2.3-.3.5s-.3.2-.5.3s-.4.1-.7.1s-.5 0-.6-.1s-.4-.2-.5-.3s-.2-.3-.3-.5s-.1-.4-.1-.6m2.8-3.1h-2.3l-.4-9.8h3z"
            />
          </svg>
        </div>

        {/* Text */}
        <div className="text-center text-black mb-8">
          <h1 className="text-3xl font-bold mb-2">Link Expired</h1>
          <p className="text-black">
            The password reset link has expired. Please request a new link to reset your password.
          </p>
        </div>

        {/* Button */}
        <Link href="sign-in\" className="block w-full">
          <button
            type="button"
            className="w-full bg-[#FFD566] hover:bg-[#FFAB00] text-white font-bold py-2 rounded transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            Back to Login
          </button>
        </Link>
      </div>

      {/* Right Image */}
      <div className="w-full md:w-1/2 h-full relative">
        <Image
          src="/img/Check Email.png"
          alt="HRIS Illustration"
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
}
