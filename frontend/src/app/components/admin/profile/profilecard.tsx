'use client';

import React, { useState } from 'react';

interface ProfileHeaderProps {
  name: string;
  lastUpdate: string;
  startDate: string;
}

export default function ProfileHeader({ name, lastUpdate, startDate }: ProfileHeaderProps) {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);
      console.log('Selected image:', file);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-6 space-y-6 border border-gray-200">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <div className="relative w-14 h-14 rounded-full bg-gray-200 overflow-hidden group">
          <img
            src={preview || '/default-profile.png'}
            alt="Profile"
            className="w-full h-full object-cover"
          />
          <label className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow cursor-pointer hover:bg-gray-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 11l6.586-6.586a2 2 0 112.828 2.828L11.828 13.828a2 2 0 01-1.414.586H9v-2.414a2 2 0 01.586-1.414z" />
            </svg>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>
        <div>
          <h2 className="text-lg font-semibold">{name}</h2>
          <p className="text-xs text-gray-500">Last update {lastUpdate} ago</p>
        </div>
      </div>

      {/* Info Grid */}
      <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-2 md:grid-cols-4 gap-y-4 text-sm text-black font-medium">
        <div>
          <p className="text-[10px] text-gray-500 uppercase">Email</p>
          <a href="mailto:Anin.pulupulu@gmail.com" className="hover:underline">Anin.pulupulu@gmail.com</a>
        </div>
        <div>
          <p className="text-[10px] text-gray-500 uppercase">Phone Number</p>
          <p>+62 8888881111</p>
        </div>
        <div>
          <p className="text-[10px] text-gray-500 uppercase">Position</p>
          <p>Manager</p>
        </div>
        <div>
          <p className="text-[10px] text-gray-500 uppercase">Account Type</p>
          <p>Employee</p>
        </div>
        <div>
          <p className="text-[10px] text-gray-500 uppercase">Start Date</p>
          <p className="font-semibold">{startDate}</p>
        </div>
        <div>
          <p className="text-[10px] text-gray-500 uppercase">Branch</p>
          <p>Manajement</p>
        </div>
        <div>
          <p className="text-[10px] text-gray-500 uppercase">Grade</p>
          <p>Management</p>
        </div>
        <div>
          <p className="text-[10px] text-gray-500 uppercase">Shift Schedule</p>
          <p className="font-semibold">Morning Person</p>
        </div>
      </div>
    </div>
  );
}
