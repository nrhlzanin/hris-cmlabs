'use client';

import React from 'react';
import { formatJakartaDate } from '@/lib/timezone';
import ProfileHeader from '@/app/components/admin/profile/profilecard';
import SalaryDetail from '@/app/components/admin/profile/salarydetail';
import WorkHours from '@/app/components/admin/profile/workhours';

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
      </div>
    </div>
  );
}