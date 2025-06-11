'use client';

import { formatJakartaDate } from '@/lib/timezone';
import React from "react";

export default function ProfilePage() {
  // Format start date using Jakarta timezone
  const startDate = formatJakartaDate(new Date('2045-12-30'), {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  const lastUpdate = formatJakartaDate(new Date(Date.now() - 24 * 60 * 60 * 1000), {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="bg-gray-100 min-h-screen py-10">
      <div className="p-6 max-w-5xl mx-auto font-sans space-y-6">
        {/* Profile Card */}
        <div className="bg-white shadow-md rounded-2xl p-6 space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden relative">
              <input
                type="file"
                accept="image/*"
                className="opacity-0 absolute w-16 h-16 cursor-pointer"
                title="Upload profile image"
              />
              <img
                src="/default-profile.png"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-xl font-bold">Anindya Nurhaliza Putri</h2>
              <p className="text-xs text-gray-500">Last update {lastUpdate} WIB</p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="font-semibold">Email</p>
              <a href="mailto:Anin.pulupulu@gmail.com" className="text-blue-600">Anin.pulupulu@gmail.com</a>
            </div>
            <div>
              <p className="font-semibold">Phone Number</p>
              <p>+62 8888881111</p>
            </div>
            <div>
              <p className="font-semibold">Position</p>
              <p>Manager</p>
            </div>
            <div>
              <p className="font-semibold">Account Type</p>
              <p>Employee</p>
            </div>
            <div>
              <p className="font-semibold">Start Date</p>
              <p>{startDate} WIB</p>
            </div>
            <div>
              <p className="font-semibold">Branch</p>
              <p>Manajement</p>
            </div>
            <div>
              <p className="font-semibold">Grade</p>
              <p>Management</p>
            </div>
            <div>
              <p className="font-semibold">Shift Schedule</p>
              <p>Morning Person</p>
            </div>
          </div>
        </div>

        {/* Detail Salary & Work Hours */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white shadow-md rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">Detail Salary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span>Gaji Pokok</span><span>Rp 3.500.000</span></div>
              <div className="flex justify-between"><span>Insentif</span><span>Rp 2.500.000</span></div>
              <div className="flex justify-between"><span>Overtime</span><span>Rp 1.500.000</span></div>
              <div className="flex justify-between"><span>Komisi</span><span>Rp 1.500.000</span></div>
              <div className="flex justify-between font-bold"><span>Total</span><span>Rp 10.000.000</span></div>
            </div>
          </div>

          {/* Work Hours */}
          <div className="bg-white shadow-md rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">Work Hours</h3>
            <div className="flex flex-col items-center justify-center">
              <div className="w-40 h-40 relative">
                <svg viewBox="0 0 36 36" className="w-full h-full">
                  <path
                    className="text-gray-300"
                    strokeWidth="3"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-green-500"
                    strokeWidth="3"
                    strokeDasharray="83, 100"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-xl font-semibold">
                  56h 30m
                </div>
              </div>
              <p className="mt-4 text-sm text-center">Day Shift: 30H</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
