// src/app/password-updated/page.tsx

"use client";

import Image from "next/image";
import Link from "next/link";

export default function PasswordUpdatedPage() {
  return (
    <div className="flex flex-col md:flex-row-reverse h-screen w-screen overflow-hidden font-inter">
      {/* Right Image Section */}
      <div className="w-full md:w-1/2 h-64 md:h-full relative">
        <Image
          src="/img/Forgot Passs.png"
          alt="HRIS Illustration"
          fill
          className="object-cover"
        />
      </div>

      {/* Left Content Section */}
      <div className="w-full md:w-1/2 h-full overflow-y-auto p-10 flex flex-col justify-center bg-white">
        {/* Icon */}
        <div className="flex justify-center mb-6">
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

        {/* Title and Text */}
        <div className="text-center mb-8 text-black">
          <h1 className="text-3xl font-bold mb-2">
            Your password has been successfully reset
          </h1>
          <p className="text-black">
            You can log in with your new password. If you encounter any issues,
            please contact support!
          </p>
        </div>

        <Link href="sign-in\">
          <button
            type="button"
            className="w-full bg-[#5AA877] hover:bg-[#257047] text-white font-bold py-2 rounded"
          >
            Login Now
          </button>
        </Link>
      </div>
    </div>
  );
}
