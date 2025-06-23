"use client";

import { useEffect, useState, MouseEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import AuthLayout from "@/app/components/auth/AuthLayout";
import { FaArrowLeft, FaEnvelope } from "react-icons/fa";


export default function CheckYourEmailPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [resendStatus, setResendStatus] = useState<{message: string; type: 'success' | 'error' } | null>(null);

  const searchParams = useSearchParams();

  useEffect(() => {
    setIsMounted(true);
    const emailFromUrl = searchParams.get("email");
    if (emailFromUrl) {
      setEmail(emailFromUrl);
    }
  }, [searchParams]);

  const handleResendEmail = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!email) return;

    setIsResending(true);
    setResendStatus(null);
    
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({ email }),
        });
        const result = await response.json();
        if (response.ok && result.success) {
            setResendStatus({ message: result.message || 'Link has been resent!', type: 'success' });
        } else {
            setResendStatus({ message: result.message || 'Failed to resend link.', type: 'error' });
        }
    } catch (error) {
        setResendStatus({ message: 'Connection error. Please try again.', type: 'error' });
    } finally {
        setIsResending(false);
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <AuthLayout
      imageUrl="/img/auth.jpg"
      imageAlt="Illustration of a person checking email"
      imagePosition="right"
    >
      <div className="text-center flex flex-col items-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full mb-6">
          <FaEnvelope className="w-20 h-20 text-gray-500 mb-6" />
        </div>
        <h1 className="text-3xl sm:text-4xl text-gray-900 font-bold mb-3">Check your email</h1>
        <p className="text-gray-600 max-w-sm mx-auto">
          We sent a password reset link to your email <strong className="text-gray-800">{email}</strong> which valid for 24 hours after receives the email, Please check your inbox!
        </p>
      </div>

      <div className="mt-8 space-y-4">
        <a
          href="https://mail.google.com"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full block bg-yellow-500 text-black font-bold py-2.5 rounded-lg shadow-md hover:shadow-lg hover:bg-yellow-400 transition-all duration-300 text-center"
        >
          Open Gmail
        </a>
        
        {resendStatus && (
            <div className={`p-3 rounded-lg text-sm text-left ${resendStatus.type === 'success' ? 'bg-green-50 border border-green-300 text-green-800' : 'bg-red-50 border border-red-300 text-red-800'}`}>
                {resendStatus.message}
            </div>
        )}

      </div>
      
      <div className="text-center text-sm mt-8 space-y-4">
        <p className="text-gray-600">
          Don't receive the email?{' '}
          <button
            onClick={handleResendEmail}
            disabled={isResending}
            className="font-semibold text-blue-600 hover:underline disabled:opacity-50 disabled:cursor-wait"
          >
            {isResending ? 'Resending...' : 'Click here to resend!'}
          </button>
        </p>

        <p>
          <Link
            href="/auth/sign-in"
            className="inline-flex items-center text-gray-600 hover:text-black font-semibold hover:underline transition-colors duration-300"
            title="Back to login page" 
          >
            <FaArrowLeft className="mr-2" aria-hidden="true" /> 
            Back to log in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}