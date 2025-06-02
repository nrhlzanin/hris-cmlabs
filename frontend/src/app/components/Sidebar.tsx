"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  RiDashboardLine,
  RiUser3Line,
  RiTimeLine,
  RiCalendarLine,
  RiBarChartBoxLine,
  RiCustomerService2Line,
  RiSettings3Line,
} from "react-icons/ri";

interface SidebarProps {
  role: "admin" | "user" | null;
}

const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  if (!role) return null;

  const pathname = usePathname();

  const basePath = `/${role}`;

  return (
    <aside
      className="w-16 bg-blue-200 flex flex-col items-center py-6 shadow-md h-screen fixed left-0 top-0 z-10 transition-transform duration-300 translate-x-0 lg:translate-x-0"
      id="sidebar-content"
    >
      {/* Top Menu */}
      <nav className="flex flex-col space-y-4 mt-[70px]">
        <Link
          href={`${basePath}/dashboard`}
          className="hover:text-blue-500"
          title="Dashboard"
        >
          <RiDashboardLine className="text-2xl text-black" />
        </Link>

        {role === "admin" && (
          <Link
            href="/admin/employee/employee-database"
            className="hover:text-blue-500"
            title="Employee"
          >
            <RiUser3Line className="text-2xl text-black" />
          </Link>
        )}

        <Link
          href={`${basePath}/checklock`}
          className="hover:text-blue-500"
          title="Checklock"
        >
          <RiTimeLine className="text-2xl text-black" />
        </Link>

        <Link
          href={`${basePath}/absensi`}
          className="hover:text-blue-500"
          title="Absensi"
        >
          <RiCalendarLine className="text-2xl text-black" />
        </Link>

        <Link
          href={`${basePath}/overtime`}
          className="hover:text-blue-500"
          title="Overtime"
        >
          <RiBarChartBoxLine className="text-2xl text-black" />
        </Link>
      </nav>

      <div className="flex-grow"></div>

      {/* Bottom Menu */}
      <nav className="flex flex-col space-y-5">
        <Link href="#" className="hover:text-blue-500" title="Customer Service">
          <RiCustomerService2Line className="text-2xl" />
        </Link>
        <Link href="#" className="hover:text-blue-500" title="Settings">
          <RiSettings3Line className="text-2xl" />
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
