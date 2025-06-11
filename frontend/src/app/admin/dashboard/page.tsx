"use client";

import { BarChart, Calendar, CheckCircle, Clock, Users, FileText, TrendingUp, AlertCircle } from "lucide-react";
import { useJakartaTime, useWorkingHours } from '@/hooks/use-timezone';
import DashboardLayout from '@/components/layout/DashboardLayout';
import AuthWrapper from '@/components/auth/AuthWrapper';

export default function DashboardPage() {
  const jakartaTime = useJakartaTime();
  const { isWorkingHours, isOvertimeHours } = useWorkingHours();
  return (
    <AuthWrapper requireAdmin={true}>
      <DashboardLayout>
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
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">John Doe checked in</p>
                  <p className="text-xs text-gray-500">2 minutes ago</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">New leave request from Sarah Wilson</p>
                  <p className="text-xs text-gray-500">15 minutes ago</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Clock className="h-4 w-4 text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Overtime request needs approval</p>
                  <p className="text-xs text-gray-500">1 hour ago</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">New employee onboarded</p>
                  <p className="text-xs text-gray-500">3 hours ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>

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
      </div>

      {/* Attendance Overview */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Today&apos;s Attendance Overview</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900">142</h4>
              <p className="text-sm text-gray-600">Present</p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900">14</h4>
              <p className="text-sm text-gray-600">Absent</p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900">7</h4>              <p className="text-sm text-gray-600">Late</p>
            </div>
          </div>
        </div>
      </div>
    </div>
      </DashboardLayout>
    </AuthWrapper>
  );
}
