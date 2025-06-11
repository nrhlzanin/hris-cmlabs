'use client';

<<<<<<< HEAD
import { CheckCircle, Clock, FileText, Calendar, MapPin, Coffee, Star, TrendingUp } from "lucide-react";
import { useJakartaTime, useWorkingHours } from '@/hooks/use-timezone';
import DashboardLayout from '@/components/layout/DashboardLayout';
import AuthWrapper from '@/components/auth/AuthWrapper';

export default function UserDashboardPage() {
  const { formattedDate } = useJakartaTime();
  const { isWorkingHours, isOvertimeHours, currentTime } = useWorkingHours();
  
  const getGreeting = () => {
    const hour = parseInt(currentTime.split(':')[0]);
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };
  return (
    <AuthWrapper requireAdmin={false}>
      <DashboardLayout>
        <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold mb-2">{getGreeting()}, John!</h1>
              <p className="text-indigo-100">Ready to make today productive?</p>
            </div>
            <div className="text-right">
              <p className="text-indigo-100 text-sm">Jakarta Time (WIB)</p>
              <p className="text-xl font-semibold">{currentTime}</p>
              <p className="text-indigo-200 text-sm">{formattedDate}</p>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Check-in Status */}
              <div className="bg-white rounded-lg shadow-sm border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Today&apos;s Status</p>
                    <p className="text-lg font-bold text-green-600">Checked In</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">08:30 AM</p>
              </div>

              {/* Work Hours */}
              <div className="bg-white rounded-lg shadow-sm border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Hours Today</p>
                    <p className="text-lg font-bold text-blue-600">6h 45m</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Target: 8 hours</p>
              </div>

              {/* Pending Requests */}
              <div className="bg-white rounded-lg shadow-sm border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-lg font-bold text-orange-600">2</p>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <FileText className="h-5 w-5 text-orange-600" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">1 leave, 1 overtime</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button className="flex flex-col items-center justify-center p-4 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200 transition-colors">
                    <MapPin className="h-6 w-6 text-red-600 mb-2" />
                    <span className="text-sm font-medium text-red-900">Check Out</span>
                  </button>

                  <button className="flex flex-col items-center justify-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors">
                    <FileText className="h-6 w-6 text-purple-600 mb-2" />
                    <span className="text-sm font-medium text-purple-900">Request Leave</span>
                  </button>

                  <button className="flex flex-col items-center justify-center p-4 bg-orange-50 hover:bg-orange-100 rounded-lg border border-orange-200 transition-colors">
                    <Clock className="h-6 w-6 text-orange-600 mb-2" />
                    <span className="text-sm font-medium text-orange-900">Overtime</span>
                  </button>

                  <button className="flex flex-col items-center justify-center p-4 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors">
                    <Calendar className="h-6 w-6 text-green-600 mb-2" />
                    <span className="text-sm font-medium text-green-900">My Schedule</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Weekly Summary */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">This Week&apos;s Summary</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">32h 15m</div>
                    <div className="text-sm text-gray-600">Total Hours</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">5</div>
                    <div className="text-sm text-gray-600">Days Present</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">0</div>
                    <div className="text-sm text-gray-600">Late Arrivals</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">2h 30m</div>
                    <div className="text-sm text-gray-600">Overtime</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-600">JD</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">John Doe</h3>
                <p className="text-sm text-gray-600">Software Developer</p>
                <p className="text-xs text-gray-500 mt-1">Employee ID: EMP001</p>
              </div>
              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Performance</span>
                  <span className="font-medium text-green-600">Excellent</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-gray-600">Department</span>
                  <span className="font-medium">Engineering</span>
                </div>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-100 rounded-lg mt-0.5">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Checked in</p>
                      <p className="text-xs text-gray-500">Today at 8:30 AM</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg mt-0.5">
                      <FileText className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Leave request submitted</p>
                      <p className="text-xs text-gray-500">Yesterday at 2:15 PM</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg mt-0.5">
                      <Star className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Performance review completed</p>
                      <p className="text-xs text-gray-500">3 days ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Upcoming</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Calendar className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Team Meeting</p>
                      <p className="text-xs text-gray-500">Tomorrow at 10:00 AM</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Coffee className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Coffee Chat with HR</p>
                      <p className="text-xs text-gray-500">Friday at 3:00 PM</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <TrendingUp className="h-4 w-4 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Quarterly Review</p>
                      <p className="text-xs text-gray-500">Next week</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>        </div>
=======
import React from 'react';
import { formatJakartaDate } from '@/lib/timezone';
import ProfileHeader from '@/app/components/User/profile/profilecard';
import SalaryDetail from '@/app/components/User/profile/salarydetail';
import WorkHours from '@/app/components/User/profile/workhours';

export default function ProfilePage() {
  const startDate = formatJakartaDate(new Date('2045-12-30'), {
    year: 'numeric', month: 'short', day: 'numeric'
  });
  const lastUpdate = formatJakartaDate(new Date(Date.now() - 86400000), {
    year: 'numeric', month: 'short', day: 'numeric'
  });

  return (
    <div className="bg-gray-100 min-h-screen py-10">
      <div className="p-6 max-w-5xl mx-auto font-sans space-y-6">
        <ProfileHeader name="Anindya Nurhaliza Putri" lastUpdate={lastUpdate} startDate={startDate} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SalaryDetail />
          <WorkHours />
        </div>
>>>>>>> b34488116d69d94048fe117e0f0b84b5481c3319
      </div>
    </div>
      </DashboardLayout>
    </AuthWrapper>
  );
}