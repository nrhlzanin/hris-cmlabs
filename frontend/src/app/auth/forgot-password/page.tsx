"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import AuthLayout from "@/app/components/auth/AuthLayout";
import { FaArrowLeft } from "react-icons/fa";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email) {
      setError("Email is required"); return;
    } else if (!emailPattern.test(email)) {
      setError("Please enter a valid email address"); return;
    }
    setError(""); setSuccessMessage(""); setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ email: email }),
      });
      const result = await response.json();
      if (response.ok && result.success) {
        setSuccessMessage(result.message || "Password reset link sent successfully!");
        setTimeout(() => {
          router.push(`/auth/check-your-email?email=${encodeURIComponent(email)}`);
        }, 2000);
      } else {
        setError(result.message || "Failed to send reset link. Please try again.");
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      setError("Connection error. Please check your internet and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <AuthLayout
      imageUrl="/img/auth.jpg" 
      imageAlt="Illustration for authentication page"
      imagePosition="right" 
    >
      <div className="text-center">
          <h1 className="text-3xl sm:text-4xl text-gray-900 font-bold mb-3">Forgot Password?</h1>
          <p className="text-gray-600 max-w-sm mx-auto">
            No worries. We'll send a password reset link to your email.
          </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        {!isLoading && error && (
            <div className="text-red-700 text-sm text-left">
                {error}
            </div>
        )}
        {!isLoading && successMessage && (
            <div className="text-green-700 text-sm text-left">
                {successMessage}
            </div>
        )}

        <div>
            <label htmlFor="email" className="sr-only">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              disabled={isLoading}
              className={`w-full border text-center sm:text-left rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-500 ${error ? "border-red-500" : "border-gray-300"}`}
            />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-red-600 text-white font-bold py-2.5 rounded-lg shadow-md hover:shadow-lg hover:bg-red-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isLoading ? 'Sending...' : 'Reset password'}
        </button>
      </form>

      <p className="text-center text-sm mt-8">
        <Link
          href="/auth/sign-in"
          className="inline-flex items-center text-gray-600 hover:text-black font-semibold hover:underline transition-colors duration-300"
          title="Back to login page" 
        >
          <FaArrowLeft className="mr-2" aria-hidden="true" /> 
          Back to log in
        </Link>
      </p>
    </AuthLayout>
  );
}