"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function SetNewPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({
    password: "",
    confirmPassword: "",
    general: "",
  });
  const [successMessage, setSuccessMessage] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  useEffect(() => {
    // Check if required parameters are present
    if (!token || !email) {
      setError({
        password: "",
        confirmPassword: "",
        general: "Invalid reset link. Please request a new password reset.",
      });
    }
  }, [token, email]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let newErrors = {
      password: "",
      confirmPassword: "",
      general: "",
    };

    if (!password) newErrors.password = "Password is required";
    if (!confirmPassword) newErrors.confirmPassword = "Please confirm your password";
    if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";

    // Enhanced password validation
    if (password && password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!token || !email) {
      newErrors.general = "Invalid reset link. Please request a new password reset.";
    }

    setError(newErrors);

    if (Object.values(newErrors).some((error) => error)) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          token: token,
          password: password,
          password_confirmation: confirmPassword,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSuccessMessage(result.message);
        // Redirect to password update success page after 2 seconds
        setTimeout(() => {
          router.push('/auth/password-update');
        }, 2000);
      } else {
        if (result.errors) {
          setError({
            password: result.errors.password?.[0] || "",
            confirmPassword: result.errors.password_confirmation?.[0] || "",
            general: result.errors.email?.[0] || result.errors.token?.[0] || "",
          });
        } else {
          setError({
            password: "",
            confirmPassword: "",
            general: result.message || "Failed to reset password. Please try again.",
          });
        }
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setError({
        password: "",
        confirmPassword: "",
        general: "Connection error. Please check your internet connection and try again.",
      });
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
          <h1 className="text-3xl sm:text-5xl font-semibold text-gray-900 mb-4">
            Set new password
          </h1>
          <p className="text-gray-700 text-lg sm:text-xl max-w-md mx-auto">
            Enter your new password below to complete the reset process.
            Ensure it’s strong and secure.
          </p>
        </div>        <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-black">
          {/* General Error Message */}
          {error.general && (
            <div className="p-3 rounded bg-red-100 border border-red-400 text-red-700 text-sm">
              {error.general}
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="p-3 rounded bg-green-100 border border-green-400 text-green-700 text-sm">
              {successMessage}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className={`w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${error.password ? "border-red-500" : ""}`}
                disabled={isLoading || !!successMessage}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-4 transform -translate-y-1/2"
                disabled={isLoading || !!successMessage}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {error.password && <p className="text-sm text-red-700">{error.password}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="password_confirmation"
                value={confirmPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                placeholder="Enter your confirm password"
                className={`w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${error.confirmPassword ? "border-red-500" : ""}`}
                disabled={isLoading || !!successMessage}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute top-1/2 right-4 transform -translate-y-1/2"
                disabled={isLoading || !!successMessage}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {error.confirmPassword && <p className="text-sm text-red-700">{error.confirmPassword}</p>}
          </div>

          {/* Reset Password Button */}
          <button
            type="submit"
            disabled={isLoading || !!successMessage || !token || !email}
            className="w-full bg-red-800 text-white font-bold py-2 rounded-lg shadow-md hover:shadow-lg hover:bg-red-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Resetting..." : "Reset password"}
          </button>

          {/* Back to Login */}
          <p className="text-center text-sm mt-4">
            <Link
              href="../auth/sign-in"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold hover:underline transition-all duration-300"
            >
              <FaArrowLeft className="mr-2" aria-hidden="true" />
              Back to log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
