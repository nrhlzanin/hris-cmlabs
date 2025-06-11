"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import SignInForm from "../../../src/app/components/auth/signin/SignInForm";
import AuthLayout from "../../../src/app/components/auth/signin/AuthLayout"; 
import SocialButton from "../../../src/app/components/auth/signin/SocialButton"; 

export default function LoginPage() {
    const [isMounted, setIsMounted] = useState(false);
  
    useEffect(() => {
      setIsMounted(true);
    }, []);
  
    if (!isMounted) {
      return null;
    }

    // Definisikan konten untuk header di sini
    const pageHeader = (
      <div className="flex justify-between items-center">
        <Image src="/img/logo/Logo HRIS-1.png" alt="HRIS Logo" width={100} height={32} />
        <Link href="/auth/sign-up" className="text-sm font-semibold text-blue-600 hover:underline">
          Try for free!
        </Link>
      </div>
    );

  return (
    <AuthLayout 
        imageUrl="/img/signin.jpg" 
        imageAlt="HRIS Illustration"
        header={pageHeader}
    >
      <h1 className="text-2xl sm:text-3xl text-gray-800 font-bold mb-2">Sign In</h1>
      <p className="mb-8 text-gray-600">
        Welcome back! Manage everything with ease.
      </p>

      <SignInForm />

      <div className="relative flex py-4 items-center">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="flex-shrink mx-4 text-gray-400 text-xs font-semibold">OR CONTINUE WITH</span>
          <div className="flex-grow border-t border-gray-200"></div>
      </div>

      <div className="flex flex-col space-y-3">
        <SocialButton 
          provider="google" 
          icon="/img/google.png" 
          text="Sign in with Google" 
        />
        <SocialButton 
          provider="apple" 
          icon="/img/apple.png" 
          text="Sign in with Apple" 
        />
      </div>

      <div className="text-center mt-8">
        <p className="text-sm text-gray-600">
          Don't have an account? <Link href="/auth/sign-up" className="text-blue-600 hover:underline">Sign up</Link>
        </p>
      </div>
    </AuthLayout>
  );
}
