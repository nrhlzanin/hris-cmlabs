"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import SignInForm from "../../components/auth/signinform";

export default function SignInPage() {
    const [isMounted, setIsMounted] = useState(false);
  
    useEffect(() => {
      setIsMounted(true);
    }, []);
  
    if (!isMounted) {
      return null;
    }

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen overflow-hidden font-inter">
      {/* Left image section */}
      <div className="w-full md:w-1/2 h-64 md:h-full relative">
        <Link
          href="/"
          className="absolute top-4 left-4 bg-gradient-to-r from-blue-500 to-blue-700 text-white px-4 py-2 rounded-full shadow-lg hover:from-blue-700 hover:to-blue-500 hover:scale-105 transition-all duration-300 flex items-center justify-center z-10"
        >
          <span className="text-xl">&#8592;</span>
        </Link>
        <Image
          src="/img/Login.png"
          alt="HRIS Illustration"
          fill
          className="object-cover"
        />
      </div>

      {/* Right form section */}
      <div className="w-full md:w-1/2 h-full overflow-y-auto flex items-center justify-center p-6 md:p-10 bg-white">
        <div className="w-full max-w-md">
          <div className="flex justify-between items-center mb-6">
            <Image src="/img/logo/Logo HRIS-1.png" alt="HRIS Logo" width={100} height={32} />
            <Link href="../auth/sign-up" className="text-blue-500 font-semibold hover:underline">
              Try for free!
            </Link>
          </div>

          <h1 className="text-3xl text-black font-bold mb-2">Sign In</h1>
          <p className="mb-6 text-black">
            Welcome back to HRIS cmlabs! Manage everything with ease.
          </p>

          <SignInForm />

          <button
            type="button"
            className="w-full bg-gradient-to-r from-gray-800 to-gray-600 hover:from-blue-300 hover:to-blue-500 text-white font-bold py-2 rounded-lg shadow-md hover:shadow-xl border-2 border-transparent hover:border-blue-500 transition-all duration-300 flex items-center justify-center gap-2 mt-4"
          >
            <Image
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              width={20}
              height={20}
            />
            Sign in with Google
          </button>

          <Link href="../auth/sign-in-id">
            <div className="w-full bg-gradient-to-r from-gray-800 to-gray-600 hover:from-blue-300 hover:to-blue-500 text-white font-bold py-2 rounded-lg shadow-md hover:shadow-xl border-2 border-transparent hover:border-blue-500 transition-all duration-300 flex items-center justify-center gap-2 mt-4">
              Sign in with Employee ID
            </div>
          </Link>
          <p className="text-center text-sm mt-4">
            Don’t have an account yet?{' '}
            <Link href="../auth/sign-up" className="text-blue-500 hover:underline">
              Sign up now and get started
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
