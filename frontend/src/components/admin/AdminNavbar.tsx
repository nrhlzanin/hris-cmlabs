"use client";

import { usePathname } from "next/navigation";
import { RiSearchLine } from "react-icons/ri";
import { NavUser } from "@/components/nav-user";

export function AdminNavbar() {
  const pathname = usePathname();
  
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
    <nav className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-background px-4">
      {/* Left: Page Name */}
      <div className="text-xl font-semibold">{getPageName()}</div>

      {/* Center: Search */}
      <div className="flex-1 px-4 max-w-2xl mx-auto">
        <div className="relative">
          <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search..."
            className="w-full rounded-md border px-10 py-2 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
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