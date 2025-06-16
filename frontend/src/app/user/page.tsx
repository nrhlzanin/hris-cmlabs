'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useJakartaTime, useWorkingHours } from '@/hooks/use-timezone';
import { useAuth } from '@/hooks/use-auth';

import NavbarLayout from '@/components/layout/NavbarLayout';
import AuthWrapper from '@/components/auth/AuthWrapper';
import WelcomeHeader from '@/app/user/components/dashboard/WelcomeHeader';
import QuickStats from '@/app/user/components/dashboard/QuickStats';
import WorkHoursChart from '@/app/user/components/dashboard/WorkHoursChart';
import WeeklySummary from '@/app/user/components/dashboard/WeeklySummary';
import ProfileCard from '@/app/user/components/dashboard/ProfileCard';
import AttendanceSummary from '@/app/user/components/dashboard/AttendanceSummary';

const UserDashboardPage: React.FC = () => {
  // 2. Inisialisasi router dan semua state yang dibutuhkan
  const router = useRouter();
  const { formattedDate } = useJakartaTime();
  const { isWorkingHours, isOvertimeHours, currentTime } = useWorkingHours();
  const { user } = useAuth();

  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Efek ini akan mensimulasikan pengambilan data status check-in saat komponen dimuat
  useEffect(() => {
    // Di aplikasi nyata, ini akan menjadi panggilan API ke server Anda
    // Untuk demo, Anda bisa ubah nilai ini untuk melihat perbedaannya
    const userHasCheckedIn = false; 

    if (userHasCheckedIn) {
      setIsCheckedIn(true);
      setCheckInTime('08:30 AM');
    }
  }, []);


  // 3. Definisikan kembali fungsi-fungsi handler untuk interaksi
  const handleStatusCardClick = () => {
    if (!isCheckedIn) {
      setIsModalOpen(true);
    }
  };

  const handleConfirmCheckIn = () => {
    setIsModalOpen(false);
    router.push('/user/checklock'); 
  };

  const getGreeting = (): string => {
    if (!currentTime) return 'Good day';
    const hour = parseInt(currentTime.split(':')[0]);
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <AuthWrapper requireAdmin={false}>
      <NavbarLayout>
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <WelcomeHeader
              greeting={getGreeting()}
              currentTime={currentTime}
              formattedDate={formattedDate}
              isWorkingHours={isWorkingHours}
              isOvertimeHours={isOvertimeHours}
              userName={user?.name || 'Guest'}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                
                <QuickStats
                  isCheckedIn={isCheckedIn}
                  checkInTime={checkInTime}
                  onStatusClick={handleStatusCardClick}
                  isModalOpen={isModalOpen}
                  onModalClose={() => setIsModalOpen(false)}
                  onModalConfirm={handleConfirmCheckIn}
                />

                <WeeklySummary />
                <WorkHoursChart />
              </div>

              <div className="space-y-6">

                <ProfileCard />
                <AttendanceSummary />
              </div>
            </div>
          </div>
        </div>
      </NavbarLayout>
    </AuthWrapper>
  );
};

export default UserDashboardPage;