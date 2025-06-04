"use client";

import { usePathname } from "next/navigation";
import { RiSearchLine } from "react-icons/ri";
import { NavUser } from "@/components/nav-user"; 

export function AdminNavbar() {
  const pathname = usePathname();

  // Get page name from URL
  const getPageTitle = () => {
    const segments = pathname?.split("/").filter(Boolean);
    const pageName = segments?.[segments.length - 1] || "Dashboard";
    return pageName
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <nav className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-white px-4 shadow-sm">
      {/* Left: Page Title */}
      <div className="text-xl font-semibold text-gray-800">
        {getPageTitle()}
      </div>

      {/* Center: Search */}
      <div className="flex-1 max-w-2xl mx-auto px-4">
        <div className="relative">
          <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            placeholder="Search..."
            className="w-full rounded-lg border border-gray-200 pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Right: User Profile */}
      <div className="ml-auto">
        <NavUser 
          user={{
            name: "Admin User",
            email: "admin@example.com",
            avatar: "/avatars/default.png"
          }}
        />
      </div>
    </nav>
  );
}