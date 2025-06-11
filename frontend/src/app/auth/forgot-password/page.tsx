"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import { useRouter } from "next/navigation"; 

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if (!email) {
      setError("Email is required");
      return;
    } else if (!emailPattern.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email: email,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSuccessMessage(result.message);
        // Redirect to check email page after 2 seconds
        setTimeout(() => {
          router.push(`/auth/check-your-email?email=${encodeURIComponent(email)}`);
        }, 2000);
      } else {
        setError(result.message || "Failed to send reset link. Please try again.");
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      setError("Connection error. Please check your internet connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

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
          <h1 className="text-4xl sm:text-5xl font-semibold text-gray-900 mb-4">
            Forgot Password
          </h1>
          <p className="text-gray-700 text-lg sm:text-xl max-w-md mx-auto">
            No worries. Enter your email address below, and we’ll send you a link to reset your password.
          </p>
        </div>
        
        {/* Input Email Field */}
        <div className="mb-6">
          <label htmlFor="email" className="block text-sm font-medium mb-1 text-gray-800">Enter your Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className={`w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${error ? "border-red-500" : ""}`}
          />          {error && <p className="text-sm text-red-700">{error}</p>}
          {successMessage && <p className="text-sm text-green-700">{successMessage}</p>}
        </div>

        {/* Reset Password Button */}
        <form onSubmit={handleSubmit}>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-red-800 text-white font-bold py-2 rounded-lg shadow-md hover:shadow-lg hover:bg-red-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Sending...' : 'Reset password'}
          </button>
        </form>

        {/* Back to Login */}
        <p className="text-center text-sm mt-4">
          <Link
            href="../auth/sign-in"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold hover:underline transition-all duration-300"
            title="Back to login page" 
          >
            <FaArrowLeft className="mr-2" aria-hidden="true" /> 
            Back to log in
          </Link>
        </p>
      </div>
    </div>
  );
}
