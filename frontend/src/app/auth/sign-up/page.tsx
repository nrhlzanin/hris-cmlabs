"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import SignUpForm from "@/app/components/auth/signupform";

export default function SignUpPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen overflow-auto bg-white font-inter">
      <div className="w-full md:w-1/2 h-64 md:h-full relative">
        <Link
          href="/"
          className="absolute top-4 left-4 z-10 flex items-center justify-center rounded-full bg-gray-800 px-4 py-2 text-white shadow-lg transition-all duration-200 ease-in-out hover:bg-gray-700 hover:-translate-y-px active:scale-95"
        >
          <span className="text-xl">&#8592;</span>
        </Link>
        <Image
          src="/img/signup.jpg"
          alt="HRIS Illustration"
          fill
          className="object-cover"
        />
      </div>

      <div className="w-full md:w-1/2 p-6 md:p-10 flex items-start justify-center overflow-auto">
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
            <Link href="../auth/sign-in" className="text-blue-500 font-semibold hover:underline">
              Login here!
            </Link>
          </div>

          <h1 className="text-3xl text-gray-800 font-bold mb-2">Sign Up</h1>
          <p className="mb-6 text-gray-800">
            Create your account and streamline your employee management.
          </p>

          <SignUpForm />

          <Link href="/auth/google">
            <button
              type="button"
              className="w-full bg-gradient-to-r from-gray-800 to-gray-600 hover:from-blue-500 hover:to-blue-300 text-white font-bold py-2 rounded-lg shadow-md hover:shadow-xl border-2 border-transparent hover:border-blue-500 transition-all duration-300 flex items-center justify-center gap-2 mt-4"
            >
              <Image
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                width={20}
                height={20}
              />
              Sign in with Google
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
