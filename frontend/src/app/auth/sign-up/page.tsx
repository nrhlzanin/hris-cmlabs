"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import SignUpForm from "@/app/components/auth/signup/signupform";
import AuthLayout from "@/app/components/auth/signup/AuthLayout";
import SocialButton from "@/app/components/auth/signup/SocialButton";

export default function SignUpPage() {
    const [isMounted, setIsMounted] = useState(false);
  
    useEffect(() => {
      setIsMounted(true);
    }, []);
  
    if (!isMounted) {
      return null;
    }

    const pageHeader = (
      <div className="flex justify-between items-center">
        <Image src="/img/logo/Logo HRIS-1.png" alt="HRIS Logo" width={100} height={32} />
        <Link href="/auth/sign-in" className="text-sm font-semibold text-blue-600 hover:underline">
          Login here!
        </Link>
      </div>
    );

  return (
    <AuthLayout
      imageUrl="/img/signup.jpg"
      imageAlt="People collaborating in an office"
      header={pageHeader} 
    >
      
      <h1 className="text-2xl sm:text-3xl text-gray-800 font-bold mb-2">Create Account</h1>
      <p className="mb-8 text-gray-600">
        Streamline your employee management from day one.
      </p>

      <SignUpForm />

      <div className="relative flex py-4 items-center">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="flex-shrink mx-4 text-gray-400 text-xs font-semibold">OR</span>
          <div className="flex-grow border-t border-gray-200"></div>
      </div>
      
      <div className="space-y-3">
        <SocialButton
          icon="https://www.svgrepo.com/show/475656/google-color.svg"
        >
          Sign in with Google
        </SocialButton>
      </div>

      <p className="text-center text-sm mt-8 text-gray-600">
        Already have an account?{' '}
        <Link href="/auth/sign-in" className="font-semibold text-blue-600 hover:underline">
          Sign in
        </Link>
      </p>

    </AuthLayout>
  );
}