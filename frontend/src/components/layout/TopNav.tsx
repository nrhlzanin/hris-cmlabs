import React, { Fragment } from 'react';
import Link from 'next/link';
import { Menu, Transition } from '@headlessui/react';
import { Bars3Icon, MagnifyingGlassIcon, BellIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

interface User {
    first_name?: string;
    last_name?: string;
    role?: string;
}

interface TopNavProps {
    setSidebarOpen: (open: boolean) => void;
    user: User | null;
    handleLogout: () => void;
}

const TopNav: React.FC<TopNavProps> = ({ setSidebarOpen, user, handleLogout }) => {
    return (
        <header className="sticky top-0 z-30 flex h-16 flex-shrink-0 items-center justify-between gap-x-6 border-b border-gray-200 bg-white px-4 sm:px-6">
            <div className="flex items-center gap-x-4">
                <button type="button" className="-m-2.5 p-2.5 text-gray-700 md:hidden" onClick={() => setSidebarOpen(true)}>
                    <Bars3Icon className="h-6 w-6" />
                </button>
            </div>

            <div className="hidden sm:flex flex-1 justify-center px-4">
                <div className="relative w-full max-w-md">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
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

            <div className="flex items-center gap-x-4">
                <button type="button" className="relative rounded-full p-2 text-gray-500 hover:bg-gray-100">
                    <BellIcon className="h-6 w-6" />
                </button>

                <div className="hidden sm:block sm:h-6 sm:w-px sm:bg-gray-200" />

                <Menu as="div" className="relative">
                    <Menu.Button className="-m-1.5 flex items-center rounded-full p-1.5 text-left transition-colors hover:bg-gray-100">
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
                        <ChevronDownIcon className="ml-2 h-5 w-5 text-gray-400" />
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
                                    <Link href="/plans" className={`block px-3 py-1.5 text-sm text-gray-900 ${active ? 'bg-gray-50' : ''}`}>
                                        Billing
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
    );
};

export default TopNav;