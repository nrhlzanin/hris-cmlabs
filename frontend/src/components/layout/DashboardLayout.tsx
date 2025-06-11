'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  HomeIcon,
  ClockIcon,
  DocumentTextIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  MagnifyingGlassIcon,
  BellIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { RiSearchLine } from 'react-icons/ri';
import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout, isAdmin, loading } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/auth/sign-in');
  };

  // Admin navigation items
  const adminNavItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon },
    { name: 'Employees', href: '/admin/employees', icon: UserGroupIcon },
    { name: 'Check Clock', href: '/admin/checklock', icon: ClockIcon },
    { name: 'Letters', href: '/admin/letter', icon: DocumentTextIcon },
    { name: 'Overtime', href: '/admin/overtime', icon: ChartBarIcon },
    { name: 'Settings', href: '/admin/settings', icon: Cog6ToothIcon },
  ];

  // User navigation items
  const userNavItems = [
    { name: 'Dashboard', href: '/user', icon: HomeIcon },
    { name: 'Check In/Out', href: '/user/checklock', icon: ClockIcon },
    { name: 'My Letters', href: '/user/letter', icon: DocumentTextIcon },
    { name: 'Overtime', href: '/user/overtime', icon: ChartBarIcon },
  ];

  const navigationItems = isAdmin ? adminNavItems : userNavItems;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 flex z-40 md:hidden ${sidebarOpen ? '' : 'hidden'}`}>
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
          <div className="flex h-16 flex-shrink-0 items-center px-4">
            <Link href="/" aria-label="Back to Homepage">
              <Image src="/img/logo/Logo HRIS-1.png" alt="HRIS Logo" width={50} height={32} priority />
            </Link>
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
                  <item.icon className="mr-4 h-6 w-6" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto bg-white border-r border-gray-200">
            <div className="flex items-center flex-shrink-0 px-4">
              <div className="flex flex-shrink-0 items-center px-4">
                <Link href="/" aria-label="Back to Homepage">
                  <Image src="/img/logo/Logo HRIS-1.png" alt="HRIS Logo" width={65} height={32} priority />
                </Link>
              </div>
            </div>
            <div className="mt-5 flex-grow flex flex-col">
              <nav className="flex-1 px-2 space-y-1">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Top navigation */}
        {/* GANTI SELURUH BLOK "Top navigation" ANDA DENGAN INI */}
        <header className="sticky top-0 z-40 flex h-16 flex-shrink-0 items-center justify-between gap-x-6 border-b border-gray-200 bg-white px-4 sm:px-6">

          {/* Kiri: Tombol Menu Mobile & Judul Halaman */}
          <div className="flex items-center gap-x-4">
            <button type="button" className="-m-2.5 p-2.5 text-gray-700 md:hidden" onClick={() => setSidebarOpen(true)}>
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">{/* Anda bisa tambahkan judul halaman dinamis di sini jika perlu */}</h1>
          </div>

          {/* Tengah: Search Bar */}
          <div className="hidden sm:flex flex-1 justify-center px-4">
            <div className="relative w-full max-w-md">
              <label htmlFor="search-field" className="sr-only">Search</label>
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                id="search-field"
                name="search"
                type="search"
                placeholder="Search..."
                className="block w-full rounded-lg border-0 bg-gray-100 py-2.5 pl-10 pr-3 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm"
              />
            </div>
          </div>

          {/* Kanan: Notifikasi & Profil */}
          <div className="flex items-center gap-x-4">
            <button type="button" className="relative rounded-full p-2 text-gray-500 hover:bg-gray-100">
              <span className="sr-only">View notifications</span>
              <BellIcon className="h-6 w-6" />
            </button>

            <div className="hidden sm:block sm:h-6 sm:w-px sm:bg-gray-200" aria-hidden="true" />

            <Menu as="div" className="relative">
              <Menu.Button className="-m-1.5 flex items-center rounded-full p-1.5 text-left transition-colors hover:bg-gray-100">
                <span className="sr-only">Open user menu</span>
                <div className="h-9 w-9 rounded-full bg-blue-800 flex items-center justify-center text-white font-bold">
                  {user?.first_name?.charAt(0).toUpperCase()}
                </div>
                <span className="hidden lg:flex lg:flex-col lg:items-start ml-3">
                  <span className="text-sm font-semibold text-gray-900">
                    {user?.first_name} {user?.last_name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {user?.role?.replace('_', ' ')}
                  </span>
                </span>
                <ChevronDownIcon className="ml-2 h-5 w-5 text-gray-400" aria-hidden="true" />
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 mt-2.5 w-48 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                  <Menu.Item>
                    {({ active }) => (
                      <Link href="/user/profile" className={`block px-3 py-1.5 text-sm text-gray-900 ${active ? 'bg-gray-50' : ''}`}>
                        Your Profile
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button onClick={handleLogout} className={`block w-full text-left px-3 py-1.5 text-sm text-gray-900 ${active ? 'bg-gray-50' : ''}`}>
                        Sign out
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </header>

        {/* Page content */}
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
