"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import SignInFormId from "../../components/auth/signinformid";

export default function SignInEmployeePage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full font-inter">
      {/* Left Image Section */}
      <div className="w-full md:w-1/2 h-64 md:h-auto relative">
        <Link
          href="/"
        className="absolute top-4 left-4 z-10 flex items-center justify-center rounded-full bg-gray-800 px-4 py-2 text-white shadow-lg transition-all duration-200 ease-in-out hover:bg-gray-700 hover:-translate-y-px active:scale-95">
          <span className="text-xl">&#8592;</span>
        </Link>
        <Image
          src="/img/signin.jpg"
          alt="HRIS Illustration"
          fill
          className="object-cover"
        />
      </div>

      {/* Right Form Section */}
      <div className="w-full md:w-1/2 h-screen overflow-y-auto flex items-center justify-center p-6 md:p-10 bg-white">
        <div className="w-full max-w-md">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <Image
                src="/img/logo/Logo HRIS-1.png"
                alt="HRIS Logo"
                width={100}
                height={32}
              />
            </div>
            <Link href="/sign-up" className="text-blue-500 font-semibold hover:underline">
              Try for free!
            </Link>
          </div>

          <h1 className="text-3xl text-black font-bold mb-2">Sign in with Employee ID</h1>
          <p className="mb-6 text-black">
            Welcome back to HRIS cmlabs! Manage everything with ease.
          </p>

          <SignInFormId />

          <Link href="../auth/sign-in">
            <button
              type="button"
              className="w-full bg-blue-500 hover:underline text-white font-bold py-2 roundedw-full bg-gradient-to-r from-gray-800 to-gray-600 hover:from-blue-300 hover:to-blue-500 text-white font-bold py-2 rounded-lg shadow-md hover:shadow-xl border-2 border-transparent hover:border-blue-500 transition-all duration-300 flex items-center justify-center gap-2 mt-4"
            >
              Use Different Method
            </button>
          </Link>
          <p className="text-center text-sm mt-4">
            Don’t have an account yet?{' '}
            <Link
              href="../auth/sign-up"
              className="text-blue-600 font-semibold hover:underline"
            >
              Sign up now and get started
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}