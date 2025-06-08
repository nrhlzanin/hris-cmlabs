'use client';

import { usePathname } from "next/navigation";
import { RiSearchLine, RiBellLine } from "react-icons/ri";
import { NavUser } from "@/components/nav-user";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function AdminNavbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false); // State to handle mobile menu visibility
  
  // Get page name from pathname
  const getPageName = () => {
    const segments = pathname?.split("/").filter(Boolean);
    const pageName = segments?.[segments.length - 1] || "Dashboard";
    return pageName
      .split("-")
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(" ");
  };

  return (
    <nav className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-background px-4 sm:px-6">
      {/* Left: Page Name */}
      <div className="text-xl font-semibold sm:flex-1">
        {getPageName()}
      </div>

      {/* Center: Search (Hidden on mobile) */}
      <div className="hidden sm:flex flex-1 px-4 max-w-2xl mx-auto">
        <div className="relative">
          <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search..."
            className="w-full rounded-md border px-10 py-2 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Right: Notification & Profile */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <Button
          variant="ghost"
          size="icon"
          aria-label="View notifications"
          className="relative"
        >
          <RiBellLine className="h-5 w-5" />
          {/* Notification Badge */}
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
            3
          </span>
        </Button>

        {/* User Profile */}
        <NavUser
          user={{
            name: "Admin User",
            email: "admin@example.com",
            avatar: "/avatars/default.png"
          }}
        />
        
        {/* Mobile Hamburger Menu */}
        <button
          onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
          className="sm:hidden text-xl"
        >
          {isMobileMenuOpen ? "×" : "☰"}
        </button>
      </div>

      {/* Mobile Menu (Dropdown) */}
      {isMobileMenuOpen && (
        <div className="sm:hidden absolute top-16 left-0 right-0 bg-white shadow-lg z-50">
          <div className="flex flex-col items-center py-4">
            <a href="/admin/dashboard" className="text-lg py-2">Dashboard</a>
            <a href="/admin/employee" className="text-lg py-2">Employee Database</a>
            <a href="/admin/checkclock" className="text-lg py-2">Checkclock</a>
            <a href="/admin/overtime" className="text-lg py-2">Overtime</a>
            <a href="/admin/letters" className="text-lg py-2">Letters</a>
          </div>
        </div>
      )}
    </nav>
  );
}
