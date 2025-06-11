"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import SignInFormId from "@/app/components/auth/signinid/SignInEmployeeForm";
import AuthLayout from "@/app/components/auth/signinid/AuthLayout";
import SocialButton from "@/app/components/auth/signinid/SocialButton";

export default function SignInEmployeePage() {
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
      
      <h1 className="text-2xl sm:text-3xl text-gray-800 font-bold mb-2">Sign In with Employee ID</h1>
      <p className="mb-8 text-gray-600">
        Enter your assigned ID and password to continue.
      </p>

      <SignInFormId />

      <div className="relative flex py-4 items-center">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="flex-shrink mx-4 text-gray-400 text-xs font-semibold">OR</span>
          <div className="flex-grow border-t border-gray-200"></div>
      </div>
      
      <div className="space-y-3">
        <SocialButton href="/auth/sign-in">
          Use Different Method
        </SocialButton>
      </div>

      <p className="text-center text-sm mt-8 text-gray-600">
        Don’t have an account yet?{' '}
        <Link href="/auth/sign-up" className="font-semibold text-blue-600 hover:underline">
          Sign up now
        </Link>
      </p>

    </AuthLayout>
  );
}