"use client";

import {
  BarChart,
  Calendar,
  CheckCircle,
  Clock,
  Users,
  FileText,
  TrendingUp,
  AlertCircle,
} from "lucide-react";

import { useJakartaTime, useWorkingHours } from "@/hooks/use-timezone";
import StatCardDashboard from "@/app/components/admin/dashboard/card";
import EmployeeBarChart from "@/app/components/admin/dashboard/chart";
import AttendancePieChart from "@/app/components/admin/dashboard/pie";
import EmployeeStatusChart from "@/app/components/admin/dashboard/statistic";
import EmployeeStatusCard from "@/app/components/admin/dashboard/status";

export default function DashboardPage() {
  const jakartaTime = useJakartaTime();
  const { isWorkingHours, isOvertimeHours } = useWorkingHours();

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome back, Admin!</h1>
            <p className="text-blue-100">
              Here's what's happening with your team today.
            </p>
          </div>
          <div className="text-right">
            <p className="text-blue-100 text-sm">Jakarta Time (WIB)</p>
            <p className="text-xl font-semibold">{jakartaTime.formattedTime}</p>
            <p className="text-blue-200 text-sm">{jakartaTime.formattedDate}</p>
            <div className="mt-2">
              {isWorkingHours && (
                <span className="inline-block bg-green-500 text-white text-xs px-2 py-1 rounded">
                  Working Hours
                </span>
              )}
              {isOvertimeHours && (
                <span className="inline-block bg-orange-500 text-white text-xs px-2 py-1 rounded">
                  Overtime Hours
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <StatCardDashboard />

      {/* Charts and Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EmployeeBarChart />
        <EmployeeStatusChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AttendancePieChart />
        <EmployeeStatusCard />
      </div>
    </div>
  );
}
