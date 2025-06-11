import React from "react";

export default function LeaveSummary() {
  return (
    <div className="p-4 bg-white rounded-xl shadow-md w-full max-w-md mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Leave Summary</h2>
        <button className="border rounded px-2 py-1 text-sm">Time Span</button>
      </div>

      <div className="bg-gray-100 rounded-lg p-4 mb-4">
        <p className="text-sm text-gray-500">Total Quota Annual Leave</p>
        <h1 className="text-2xl font-bold">12 Days</h1>
        <button className="mt-2 w-full bg-blue-900 text-white py-2 rounded-md text-sm font-medium">
          Request Leave
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-100 rounded-lg p-4">
          <p className="text-sm text-gray-500">Taken</p>
          <h2 className="text-xl font-bold">4 Days</h2>
          <button className="mt-2 w-full bg-blue-200 text-white py-2 rounded-md text-sm font-medium">
            See Details
          </button>
        </div>
        <div className="bg-gray-100 rounded-lg p-4">
          <p className="text-sm text-gray-500">Remaining</p>
          <h2 className="text-xl font-bold">8 Days</h2>
          <button className="mt-2 w-full bg-blue-500 text-white py-2 rounded-md text-sm font-medium">
            Request Leave
          </button>
        </div>
      </div>
    </div>
  );
}
