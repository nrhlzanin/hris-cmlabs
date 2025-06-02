// src/app/sign-in/id/page.tsx

"use client";

import Image from "next/image";
import Link from "next/link";

export default function SignInEmployeePage() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full font-inter">
      {/* Left Image Section */}
      <div className="w-full md:w-1/2 h-64 md:h-auto relative">
        <Link
          href="/"
          className="absolute top-4 left-4 bg-[#2D8EFF] hover:bg-[#1E3A5F] text-white px-4 py-2 rounded-full shadow-lg flex items-center justify-center z-10"
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
            <Link href="/sign-up" className="text-blue-600 font-semibold hover:underline">
              Try for free!
            </Link>
          </div>

          <h1 className="text-3xl text-black font-bold mb-2">Sign in with ID Employee</h1>
          <p className="mb-6 text-black">
            Welcome back to HRIS cmlabs! Manage everything with ease.
          </p>

          <form className="space-y-5 text-black">
            <div>
              <label className="block text-sm font-medium mb-1">Company Username</label>
              <input
                type="text"
                name="username"
                placeholder="Enter your Company Username"
                className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">ID Employee (NIK)</label>
              <input
                type="text"
                name="nik"
                placeholder="Enter your ID Employee"
                className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex items-center text-sm justify-between">
              <div className="flex items-center">
                <input type="checkbox" id="remember" name="remember" className="mr-2" />
                <label htmlFor="remember" className="cursor-pointer">
                  Remember me
                </label>
              </div>
              <Link
                href="forgot-password\"
                className="text-blue-600 font-semibold hover:underline"
              >
                Forgot your password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-[#2D8EFF] hover:bg-[#1E3A5F] text-white font-bold py-2 rounded"
            >
              SIGN IN
            </button>

            <Link href="sign-in\">
              <button
                type="button"
                className="w-full bg-[#595959] hover:bg-[#2D8EFF] text-white font-bold py-2 rounded"
              >
                Use Different Method
              </button>
            </Link>

            <p className="text-center text-sm mt-4">
              Don’t have an account yet?{' '}
              <Link
                href="/sign-up"
                className="text-blue-600 font-semibold hover:underline"
              >
                Sign up now and get started
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}