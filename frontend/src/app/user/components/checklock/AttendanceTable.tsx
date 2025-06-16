'use client';

import React from 'react';
import { AttendanceRecord } from '@/services/attendance';

interface AttendanceTableProps {
  attendanceData: AttendanceRecord[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  onOpenOvertimeModal: (recordId: number) => void;
}

const AttendanceTable: React.FC<AttendanceTableProps> = ({ attendanceData, loading, error, searchTerm, onOpenOvertimeModal }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-4 text-gray-600">Loading attendance records...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-4 p-4 bg-red-50 border border-red-300 text-red-700 rounded-lg text-center">
        <p><strong>Error:</strong> {error}</p>
      </div>
    );
  }

  if (attendanceData.length === 0) {
    return (
      <div className="my-4 py-16 text-center text-gray-500">
        <p>{searchTerm ? 'No records found matching your search.' : 'No attendance records found.'}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-50 text-gray-600 uppercase tracking-wider">
          <tr>
            <th className="px-6 py-3">Date</th>
            <th className="px-6 py-3">Clock In</th>
            <th className="px-6 py-3">Clock Out</th>
            <th className="px-6 py-3">Work Hours</th>
            <th className="px-6 py-3 text-center">Status</th>
            <th className="px-6 py-3 text-center">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y bg-white">
          {attendanceData.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">{item.date}</td>
              <td className="px-6 py-4 whitespace-nowrap">{item.clockIn}</td>
              <td className="px-6 py-4 whitespace-nowrap">{item.clockOut || '-'}</td>
              <td className="px-6 py-4 whitespace-nowrap">{item.workHours || '-'}</td>
              <td className="px-6 py-4 text-center">
                <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  item.statusColor === 'green' ? 'bg-green-100 text-green-800'
                  : item.statusColor === 'red' ? 'bg-red-100 text-red-800'
                  : 'bg-gray-100 text-gray-800'
                }`}>
                  {item.status}
                </span>
              </td>
              <td className="px-6 py-4 text-center">
                <button
                  onClick={() => onOpenOvertimeModal(item.id)}
                  className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-md hover:bg-blue-200 transition-colors"
                  title="Request Overtime"
                >
                  Request OT
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceTable;