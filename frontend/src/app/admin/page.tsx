'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

import { useJakartaTime, useWorkingHours } from '@/hooks/use-timezone';
import { useAuth } from '@/hooks/use-auth';

import NavbarLayout from '@/components/layout/NavbarLayout';
import AuthWrapper from '@/components/auth/AuthWrapper';
import WelcomeHeader from '@/app/admin/components/dashboard/WelcomeHeader';
import StatsGrid from '@/app/admin/components/dashboard/StatsGrid';
import EmployeeBarChart from '@/app/admin/components/dashboard/EmployeeBarChart';
import EmployeeStatusCard from '@/app/admin/components/dashboard/EmployeeStatusCard';
import AttendanceOverview from '@/app/admin/components/dashboard/AttendanceOverview';

export default function DashboardPage() {
  const jakartaTime = useJakartaTime();
  const { isWorkingHours, isOvertimeHours } = useWorkingHours();
  const { user } = useAuth(); 

  const getGreeting = (): string => {
    if (!jakartaTime.formattedTime) return 'Good day';
    const hour = parseInt(jakartaTime.formattedTime.split(':')[0]);
    if (hour >= 5 && hour < 12) return 'Good morning';
    if (hour >= 12 && hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const userName = user?.name || "Admin";

  return (
    <AuthWrapper requireAdmin={true}>
      <NavbarLayout>
        <div className="flex flex-col gap-6 p-6">
          <WelcomeHeader
            greeting={getGreeting()}
            currentTime={jakartaTime.formattedTime}
            formattedDate={jakartaTime.formattedDate}
            isWorkingHours={isWorkingHours}
            isOvertimeHours={isOvertimeHours}
            userName={userName}
          />
          <StatsGrid />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <EmployeeBarChart />
            <EmployeeStatusCard />
          </div>

          <AttendanceOverview />
        </div>
      </NavbarLayout>
    </AuthWrapper>
  );
}