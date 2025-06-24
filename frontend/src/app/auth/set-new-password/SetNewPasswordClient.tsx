'use client';

import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AuthLayout from "@/app/components/auth/AuthLayout";
import Link from "next/link";
import { FaArrowLeft, FaEye, FaEyeSlash } from "react-icons/fa";

interface PasswordInputProps {
    label: string;
    name: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
    disabled: boolean;
    error?: string;
    showPasswordState: boolean;
    toggleShowPassword: () => void;
}

function PasswordInput({
    label, name, value, onChange, placeholder, disabled, error, showPasswordState, toggleShowPassword
    }: PasswordInputProps) {
    return (
    <div>
        <label htmlFor={name} className="block text-sm font-medium mb-1 text-gray-700">{label}</label>
    <div className="relative">
        <input
            id={name}
            type={showPasswordState ? "text" : "password"}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            className={`w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-500 ${error ? "border-red-500" : "border-gray-300"}`}
            />
        <button
            type="button"
            onClick={toggleShowPassword}
            disabled={disabled}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            aria-label={showPasswordState ? "Hide password" : "Show password"}
            >
            {showPasswordState ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
        </button>
    </div>
    {error && <p className="text-sm text-red-700 mt-1">{error}</p>}
    </div>
    );
}

export default function SetNewPasswordClient() {
    const [isMounted, setIsMounted] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState({ password: "", confirmPassword: "", general: "" });
    const [successMessage, setSuccessMessage] = useState("");
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const email = searchParams.get("email");
    
    useEffect(() => {
        setIsMounted(true);
        if (!token || !email) {
        setError(prev => ({ ...prev, general: "Invalid or missing reset link parameters." }));
        }
    }, [token, email]);
    
const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors = { password: "", confirmPassword: "", general: "" };
    
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 8) newErrors.password = "Password must be at least 8 characters";
    if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    if (!token || !email) newErrors.general = "Invalid reset link. Please request a new password reset.";
    
    setError(newErrors);
    if (Object.values(newErrors).some(err => err)) return;
    
    setIsLoading(true);
    setSuccessMessage("");
    
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({ email, token, password, password_confirmation: confirmPassword }),
            });
            const result = await response.json();
            if (response.ok && result.success) {
                setSuccessMessage(result.message || "Password has been reset successfully!");
                setTimeout(() => router.push('/auth/password-update-success'), 2000);
            } else {
                setError(prev => ({...prev, general: result.message || "Failed to reset password. Please try again."}));
            }
        } catch (err) {
            setError(prev => ({...prev, general: "Connection error. Please try again."}));
        } finally {
            setIsLoading(false);
        }
    };
    
    if (!isMounted) return null;
    
    return (
        <AuthLayout
        imageUrl="/img/auth.jpg"
        imageAlt="Illustration for authentication page"
        imagePosition="right"
        >
    <div>
        <h1 className="text-2xl sm:text-3xl text-gray-900 font-bold mb-2">Set new password</h1>
        <p className="text-gray-600">
        Enter your new password below to complete the reset process. Ensure it’s strong and secure.
        </p>
    </div>

    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        {error.general && (
        <div className="text-red-700 text-sm">
            {error.general}
        </div>
        )}
        {successMessage && (
        <div className="text-green-700 text-sm">
            {successMessage}
        </div>
        )}
        
        <PasswordInput
        label="Password"
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter your new password"
        disabled={isLoading || !!successMessage}
        error={error.password}
        showPasswordState={showPassword}
        toggleShowPassword={() => setShowPassword(!showPassword)}
        />
        <PasswordInput
        label="Confirm Password"
        name="password_confirmation"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Confirm your new password"
        disabled={isLoading || !!successMessage}
        error={error.confirmPassword}
        showPasswordState={showConfirmPassword}
        toggleShowPassword={() => setShowConfirmPassword(!showConfirmPassword)}
        />

        <button
        type="submit"
        disabled={isLoading || !!successMessage || !token || !email}
        className="w-full bg-red-600 text-white font-bold py-2.5 rounded-lg shadow-md hover:shadow-lg hover:bg-red-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
        {isLoading ? 'Resetting...' : 'Reset password'}
        </button>
    </form>

    <p className="text-center text-sm mt-8">
        <Link
        href="/auth/sign-in"
        className="inline-flex items-center text-gray-600 hover:text-black font-semibold hover:underline transition-colors duration-300"
        >
        <FaArrowLeft className="mr-2" />
        Back to log in
        </Link>
    </p>
    </AuthLayout>
    );
}
