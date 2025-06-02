// src/app/forgot-password/page.tsx

"use client";

import Image from "next/image";
import Link from "next/link";

export default function ForgotPasswordPage() {
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
          <h1 className="text-3xl text-black font-bold mb-2">Forgot Password</h1>
          <p className="text-black">
            No worries. Enter your email address below, and we’ll send you a link to reset your password.
          </p>
        </div>

        <Link href="check-your-email\">
          <button
            type="button"
            className="w-full bg-[#BA3C54] hover:bg-[#C11106] text-white font-bold py-2 rounded"
          >
            Reset password
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
