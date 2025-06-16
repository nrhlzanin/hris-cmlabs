import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

interface MobileSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  navigationItems: NavItem[];
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({ sidebarOpen, setSidebarOpen, navigationItems }) => {
  if (!sidebarOpen) return null;

  return (
    <div className="fixed inset-0 flex z-40 md:hidden">
      <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
      <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-white">
        <div className="absolute top-0 right-0 -mr-12 pt-2">
          <button
            className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            onClick={() => setSidebarOpen(false)}
          >
            <XMarkIcon className="h-6 w-6 text-white" />
          </button>
        </div>
        <div className="flex-shrink-0 px-4">
          <div className="relative w-24 aspect-[65/32]">
            <Link href="/" aria-label="Back to Homepage">
              <Image
                src="/img/logo/Logo HRIS-1.png"
                alt="HRIS Logo"
                layout="fill"
                objectFit="contain"
                priority
              />
            </Link>
          </div>
        </div>
        <div className="mt-5 flex-1 h-0 overflow-y-auto">
          <nav className="px-2 space-y-1">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="mr-4 h-6 w-6 text-gray-400 group-hover:text-gray-500" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default MobileSidebar;