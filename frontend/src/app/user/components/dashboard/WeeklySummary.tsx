import React from 'react';

const WeeklySummary: React.FC = () => {
  return (
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
  );
};

export default WeeklySummary;