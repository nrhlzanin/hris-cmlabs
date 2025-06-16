import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

interface DesktopSidebarProps {
  navigationItems: NavItem[];
}

const DesktopSidebar: React.FC<DesktopSidebarProps> = ({ navigationItems }) => {
  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto bg-white border-r border-gray-200">
          <div className="flex items-center flex-shrink-0 px-4">
            
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
          <div className="mt-5 flex-grow flex flex-col">
            <nav className="flex-1 px-2 space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                >
                  <item.icon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopSidebar;