'use client';

import { BarChart, Calendar, CheckCircle, Clock, Users, FileText, TrendingUp, AlertCircle } from "lucide-react";
import { useJakartaTime, useWorkingHours } from '@/hooks/use-timezone';
import { AttendanceOverview } from '@/components/dashboard/AttendanceOverview';
import { RecentActivities } from '@/components/dashboard/RecentActivities';
import { TodayStatusTable } from '@/components/dashboard/TodayStatusTable';
import { StatCard } from '@/components/ui/StatCard';

export default function DashboardPage() {
  const jakartaTime = useJakartaTime();
  const { isWorkingHours, isOvertimeHours } = useWorkingHours();

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl p-6">
        <div className="flex justify-between items-start">
          <div>            <h1 className="text-2xl font-bold mb-2">Welcome back, Admin!</h1>
            <p className="text-blue-100">Here&apos;s what&apos;s happening with your team today.</p>
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
      </div>      {/* Stats Grid - Using AttendanceOverview component */}
      <AttendanceOverview />      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity - Using RecentActivities component */}
        <RecentActivities />

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <button className="flex flex-col items-center justify-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors">
                <Users className="h-6 w-6 text-blue-600 mb-2" />
                <span className="text-sm font-medium text-blue-900">Add Employee</span>
              </button>

              <button className="flex flex-col items-center justify-center p-4 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors">
                <CheckCircle className="h-6 w-6 text-green-600 mb-2" />
                <span className="text-sm font-medium text-green-900">Approve Requests</span>
              </button>

              <button className="flex flex-col items-center justify-center p-4 bg-orange-50 hover:bg-orange-100 rounded-lg border border-orange-200 transition-colors">
                <BarChart className="h-6 w-6 text-orange-600 mb-2" />
                <span className="text-sm font-medium text-orange-900">View Reports</span>
              </button>

              <button className="flex flex-col items-center justify-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors">
                <Calendar className="h-6 w-6 text-purple-600 mb-2" />
                <span className="text-sm font-medium text-purple-900">Schedule Meeting</span>
              </button>
            </div>
          </div>
        </div>
      </div>      {/* Today's Employee Status Table */}
      <TodayStatusTable />
    </div>
  );
}
