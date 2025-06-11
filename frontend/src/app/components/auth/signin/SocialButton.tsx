import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";

interface SocialButtonProps {
  href?: string;
  onClick?: () => void;
  icon?: string;
  children: ReactNode;
}

export default function SocialButton({ href, onClick, icon, children }: SocialButtonProps) {
  const commonClasses = "w-full text-white font-bold py-2.5 rounded-lg shadow-md transition-all duration-300 flex items-center justify-center gap-3 mt-4 text-sm";
  
  const buttonContent = (
    <>
      {icon && <Image src={icon} alt="" width={22} height={22} />}
      {children}
    </>
  );

  // Jika ada href, gunakan Link. Jika tidak, gunakan button.
  if (href) {
    return (
      <Link href={href} className={`${commonClasses} bg-gray-700 hover:bg-gray-900`}>
          {buttonContent}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={`${commonClasses} bg-gray-700 hover:bg-gray-900`}>
      {buttonContent}
    </button>
  );
}