import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/ui/StatCard';
import { dashboardService, AttendanceSummary } from '@/services/dashboard';
import { Users, UserCheck, UserX, Clock, AlertTriangle } from 'lucide-react';

export function AttendanceOverview() {
  const [attendanceData, setAttendanceData] = useState<AttendanceSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAttendanceData();
    // Set up real-time updates every 30 seconds
    const interval = setInterval(fetchAttendanceData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchAttendanceData = async () => {
    try {
      setError(null);
      const data = await dashboardService.getAttendanceSummary();
      setAttendanceData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch attendance data');
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-600">Attendance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-600 text-sm">
            <AlertTriangle className="inline w-4 h-4 mr-2" />
            {error}
          </div>
          <button 
            onClick={fetchAttendanceData}
            className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
          >
            Retry
          </button>
        </CardContent>
      </Card>
    );
  }

  const getAttendanceRate = () => {
    if (!attendanceData) return 0;
    return Math.round((attendanceData.present_today / attendanceData.total_employees) * 100);
  };

  const getAttendanceRateColor = (rate: number) => {
    if (rate >= 90) return 'green';
    if (rate >= 75) return 'yellow';
    return 'red';
  };

  const attendanceRate = getAttendanceRate();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Attendance Overview</h2>
        <div className="text-xs text-gray-500">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Employees"
          value={attendanceData?.total_employees || 0}
          description="Active employees"
          icon={Users}
          color="blue"
          isLoading={isLoading}
        />
        
        <StatCard
          title="Present Today"
          value={attendanceData?.present_today || 0}
          description={`${attendanceRate}% attendance`}
          icon={UserCheck}
          color="green"
          isLoading={isLoading}
        />
        
        <StatCard
          title="Absent Today"
          value={attendanceData?.absent_today || 0}
          description="Employees absent"
          icon={UserX}
          color="red"
          isLoading={isLoading}
        />
        
        <StatCard
          title="Late Arrivals"
          value={attendanceData?.late_today || 0}
          description="Late today"
          icon={Clock}
          color="yellow"
          isLoading={isLoading}
        />
        
        <StatCard
          title="Early Departures"
          value={attendanceData?.early_leave_today || 0}
          description="Left early"
          icon={AlertTriangle}
          color="purple"
          isLoading={isLoading}
        />
      </div>

      {/* Attendance Rate Summary Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Today's Attendance Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className={`text-3xl font-bold ${
                attendanceRate >= 90 ? 'text-green-600' : 
                attendanceRate >= 75 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {attendanceRate}%
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {attendanceData?.present_today || 0} out of {attendanceData?.total_employees || 0} employees
              </p>
            </div>
            <div className="w-24 h-24">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke={attendanceRate >= 90 ? '#059669' : attendanceRate >= 75 ? '#d97706' : '#dc2626'}
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${attendanceRate * 2.51} 251`}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
