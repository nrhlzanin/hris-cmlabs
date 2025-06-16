'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import {
  HomeIcon,
  ClockIcon,
  DocumentTextIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

import DesktopSidebar from './DesktopSidebar';
import MobileSidebar from './MobileSidebar';
import TopNav from './TopNav';

interface NavbarLayoutProps {
  children: React.ReactNode;
}

export default function NavbarLayout({ children }: NavbarLayoutProps) {
  const { user, logout, isAdmin, loading } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/auth/sign-in');
  };

  const adminNavItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon },
    { name: 'Employees', href: '/admin/employee/employee-database', icon: UserGroupIcon },
    { name: 'Check Clock', href: '/admin/checklock', icon: ClockIcon },
    { name: 'Letters', href: '/admin/letter', icon: DocumentTextIcon },
    { name: 'Overtime', href: '/admin/overtime', icon: ChartBarIcon },
    { name: 'Settings', href: '/admin/settings', icon: Cog6ToothIcon },
  ];

  const userNavItems = [
    { name: 'Dashboard', href: '/user', icon: HomeIcon },
    { name: 'Check In/Out', href: '/user/checklock', icon: ClockIcon },
    { name: 'My Letters', href: '/user/letter', icon: DocumentTextIcon },
    { name: 'Overtime', href: '/user/overtime', icon: ChartBarIcon },
  ];

  const navigationItems = isAdmin ? adminNavItems : userNavItems;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      <MobileSidebar 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        navigationItems={navigationItems}
      />
      
      <DesktopSidebar navigationItems={navigationItems} />

      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <TopNav
          setSidebarOpen={setSidebarOpen}
          user={user}
          handleLogout={handleLogout}
        />
        
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}