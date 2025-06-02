"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { RiMenuLine, RiSearchLine, RiArrowDownSLine } from "react-icons/ri";

export default function Navbar() {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const getTitle = () => {
    const segments = pathname?.split("/").filter(Boolean);
    const titleSegment = segments?.[segments.length - 1] || "Dashboard";
    return titleSegment
      .split("-")
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(" ");
  };

  const toggleSidebar = () => {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("overlay");
    sidebar?.classList.toggle("-translate-x-full");
    overlay?.classList.toggle("hidden");
  };

  return (
    <nav className="bg-white px-4 md:px-6 py-4 flex items-center justify-between shadow w-full fixed top-0 left-0 z-50">
      {/* Left: Logo & Title */}
      <div className="flex items-center space-x-4">
        {/* Toggle Button (mobile only) */}
        <button className="md:hidden text-gray-600" onClick={toggleSidebar}>
          <RiMenuLine className="text-2xl" />
        </button>

        <Image
          src="/img/logo/Logo HRIS-1.png"
          alt="Logo"
          width={40}
          height={40}
          className="h-10 w-auto"
        />

        <h1 className="text-lg md:text-xl font-bold pl-2 md:pl-6">
          {getTitle()}
        </h1>
      </div>

      {/* Center: Search Bar */}
      <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 items-center">
        <input
          type="text"
          placeholder="Search"
          className="w-[300px] lg:w-[400px] px-4 py-2 border rounded-l-lg focus:outline-none focus:ring focus:border-blue-300 text-sm"
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600">
          <RiSearchLine />
        </button>
      </div>

      {/* Right: Notification & User */}
      <div className="flex items-center space-x-4">
        <button className="text-gray-600 hover:text-blue-500">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 
                14.158V11a6.002 6.002 0 00-4-5.659V5a2 
                2 0 10-4 0v.341C7.67 6.165 6 8.388 6 
                11v3.159c0 .538-.214 1.055-.595 
                1.436L4 17h5m6 0v1a3 3 0 11-6 
                0v-1m6 0H9"
            />
          </svg>
        </button>

        {/* User Dropdown */}
        <div className="relative">
          <button className="flex items-center space-x-2 focus:outline-none">
            <div className="w-8 h-8 rounded-full bg-blue-800" />
            <div className="text-sm text-gray-700 hidden md:block">
              <div>username</div>
            </div>
            <RiArrowDownSLine className="text-gray-700" />
          </button>
          {/* Optional: dropdown menu */}
        </div>
      </div>
    </nav>
  );
}
