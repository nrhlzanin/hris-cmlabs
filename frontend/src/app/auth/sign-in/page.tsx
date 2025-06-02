// src/app/auth/sign-in/page.tsx

"use client";

import Image from "next/image";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="flex h-screen w-screen overflow-hidden font-inter">
      {/* Left image section */}
      <div className="w-1/2 h-full relative">
        <Link
          href="/"
          className="absolute top-4 left-4 bg-[#2D8EFF] text-white px-4 py-2 rounded-full shadow-lg hover:bg-[#1E3A5F] flex items-center justify-center z-10"
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
      <div className="w-1/2 h-full overflow-y-auto flex items-center justify-center p-10 bg-white">
        <div className="w-full max-w-md">
          <div className="flex justify-between items-center mb-6">
            <Image src="/img/logo/Logo HRIS-1.png" alt="HRIS Logo" width={100} height={32} />
            <Link href="sign-up/" className="text-[#2D8EFF] font-semibold hover:underline">
              Try for free!
            </Link>
          </div>

          <h1 className="text-3xl text-black font-bold mb-2">Sign In</h1>
          <p className="mb-6 text-black">
            Welcome back to HRIS cmlabs! Manage everything with ease.
          </p>

          <form className="space-y-5 text-black">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="email">
                Email or Phone Number
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="flex items-center text-sm justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" /> Remember Me
              </label>
              <Link href="forgot-password\" className="text-dodgerblue font-semibold hover:underline">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-[#2D8EFF] hover:bg-[#1E3A5F] text-white font-bold py-2 rounded"
            >
              SIGN IN
            </button>

            <button
              type="button"
              className="w-full bg-[#595959] hover:bg-[#2D8EFF] text-white font-bold py-2 rounded flex items-center justify-center gap-2"
            >
              <Image
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                width={20}
                height={20}
              />
              Sign in with Google
            </button>

            <Link href="sign-in-id/">
              <div className="w-full bg-[#595959] hover:bg-[#2D8EFF] text-white font-bold py-2 rounded text-center mt-2">
                Sign in with Employee ID
              </div>
            </Link>

            <p className="text-center text-sm mt-4">
              Don’t have an account yet?{' '}
              <Link href="sign-up/" className="text-[#2D8EFF] hover:underline">
                Sign up now and get started
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
