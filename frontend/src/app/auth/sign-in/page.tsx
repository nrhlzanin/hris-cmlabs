"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import SignInForm from "@/app/components/auth/signin/SignInForm";
import AuthLayout from "@/app/components/auth/signin/AuthLayout"; 
import SocialButton from "@/app/components/auth/signin/SocialButton"; 

export default function SignInPage() {
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
        header={pageHeader} // Lewatkan header sebagai prop
    >
      {/* Konten di sini sekarang hanya berisi form dan tombol, 
        karena header sudah dipindahkan.
      */}
      
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
      
      <div className="space-y-3">
        <SocialButton icon="https://www.svgrepo.com/show/475656/google-color.svg">
          Sign in with Google
        </SocialButton>
        
        <SocialButton href="/auth/sign-in-id">
          Sign in with Employee ID
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