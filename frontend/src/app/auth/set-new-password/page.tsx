"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useRouter } from "next/navigation"; // Import useRouter

export default function SetNewPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState({
    password: "",
    confirmPassword: "",
  });

  const router = useRouter(); // Initialize the router

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let newErrors = {
      password: "",
      confirmPassword: "",
    };

    if (!password) newErrors.password = "Password is required";
    if (!confirmPassword) newErrors.confirmPassword = "Please confirm your password";
    if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";

    setError(newErrors);

    if (!Object.values(newErrors).some((error) => error)) {
      console.log("Password reset successful");
      router.push("../auth/password-update"); // Redirect to password-update page
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
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-black">
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
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-4 transform -translate-y-1/2"
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
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute top-1/2 right-4 transform -translate-y-1/2"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {error.confirmPassword && <p className="text-sm text-red-700">{error.confirmPassword}</p>}
          </div>

          {/* Reset Password Button */}
          <button
            type="submit"
            className="w-full bg-red-800 text-white font-bold py-2 rounded-lg shadow-md hover:shadow-lg hover:bg-red-700 transition-all duration-300"
          >
            Reset password
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
