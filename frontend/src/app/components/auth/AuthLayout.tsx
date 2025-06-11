import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

interface AuthLayoutProps {
  imageUrl: string;
  imageAlt: string;
  header?: ReactNode;
  children: ReactNode;
  imagePosition?: 'left' | 'right';
}

export default function AuthLayout({ 
  imageUrl, 
  imageAlt, 
  header, 
  children, 
  imagePosition = 'left'
}: AuthLayoutProps) {
  
  const layoutClasses = imagePosition === 'right' ? 'md:flex-row-reverse' : 'md:flex-row';
  const backButtonClasses = imagePosition === 'right' ? 'right-6' : 'left-6';

  return (
    <div className={`flex flex-col ${layoutClasses} h-screen w-screen overflow-hidden font-inter bg-white`}>
      <div className="hidden md:block md:w-1/2 lg:w-[55%] h-full relative">
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      </div>

      {/* Kolom Form */}
      <div className="w-full md:w-1/2 lg:w-[45%] h-full overflow-y-auto">
        <div className="w-full max-w-md mx-auto px-6 sm:px-10 flex flex-col justify-center min-h-full py-12">
          {header && (
            <header className="mb-8">
              {header}
            </header>
          )}
          
          <main>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}