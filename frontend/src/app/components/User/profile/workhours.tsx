import React from 'react';

export default function WorkHours() {
  return (
    <div className="bg-white shadow-md rounded-2xl p-6">
      <h3 className="text-lg font-semibold mb-4">Work Hours</h3>
      <div className="flex flex-col items-center justify-center">
        <div className="w-40 h-40 relative">
          <svg viewBox="0 0 36 36" className="w-full h-full">
            <path className="text-gray-300" strokeWidth="3" stroke="currentColor" fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            <path className="text-green-700" strokeWidth="3" strokeDasharray="83, 100" strokeLinecap="round" stroke="currentColor" fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-xl font-semibold">56h 30m</div>
        </div>
        <p className="mt-4 text-sm text-center">Day Shift: 30H</p>
      </div>
    </div>
  );
}