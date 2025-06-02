// src/app/sign-up/page.tsx

"use client";

import Image from "next/image";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="flex flex-col md:flex-row h-screen w-screen overflow-auto bg-white font-inter">
      {/* Left Image Section */}
      <div className="w-full md:w-1/2 h-64 md:h-full relative">
        <Link
          href="/"
          className="absolute top-4 left-4 bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-600 flex items-center justify-center z-10"
        >
          <span className="text-xl">&#8592;</span>
        </Link>
        <Image
          src="/img/Sign Up.png"
          alt="HRIS Illustration"
          fill
          className="object-cover"
        />
      </div>

      {/* Right Form Section */}
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
            <Link href="sign-in/" className="text-[#2D8EFF] font-semibold hover:underline">
              Login here!
            </Link>
          </div>

          <h1 className="text-3xl text-black font-bold mb-2">Sign Up</h1>
          <p className="mb-6 text-black">
            Create your account and streamline your employee management.
          </p>

          <form className="space-y-5 text-black">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  placeholder="Enter your first name"
                  className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  placeholder="Enter your last name"
                  className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
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
            <div>
              <label className="block text-sm font-medium mb-1">Confirm Password</label>
              <input
                type="password"
                name="password_confirmation"
                placeholder="Enter your confirm password"
                className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex items-center text-sm">
              <input type="checkbox" id="terms" className="mr-2" />
              <label htmlFor="terms">
                I agree with the{' '}
                <a href="#" className="hover:underline">
                  terms
                </a>{' '}
                of use of HRIS
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-[#2D8EFF] hover:bg-[#1E3A5F] text-white font-bold py-2 rounded"
            >
              SIGN UP
            </button>
          </form>

          <Link href="/auth/google">
            <button
              type="button"
              className="w-full bg-[#595959] hover:bg-[#2D8EFF] text-white font-bold py-2 rounded flex items-center justify-center gap-2 mt-4"
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