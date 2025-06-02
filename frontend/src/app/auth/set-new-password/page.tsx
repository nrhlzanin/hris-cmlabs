// src/app/set-new-password/page.tsx

"use client";

import Image from "next/image";
import Link from "next/link";

export default function SetNewPasswordPage() {
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

      {/* Left Form Section */}
      <div className="w-full md:w-1/2 h-full overflow-y-auto p-10 flex flex-col justify-center bg-white">
        <div className="text-center mb-8">
          <h1 className="text-3xl text-black font-bold mb-2">Set new password</h1>
          <p className="text-black">
            Enter your new password below to complete the reset process.
            Ensure it’s strong and secure.
          </p>
        </div>

        <form className="flex flex-col gap-6 text-black">
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm your password"
              className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <Link href="password-update\">
            <button
              type="button"
              className="w-full bg-[#BA3C54] hover:bg-[#C11106] text-white font-bold py-2 rounded"
            >
              Reset password
            </button>
          </Link>

          <p className="text-center text-sm">
            <Link href="sign-in\" className="text-blue-600 hover:underline">
              ← Back to log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
