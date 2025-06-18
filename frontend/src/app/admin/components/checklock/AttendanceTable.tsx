'use client';

import React from 'react';
import { FaCheck, FaTimes } from "react-icons/fa";
import { AdminAttendanceRecord } from '@/services/attendance';

interface AttendanceTableProps {
  attendanceList: AdminAttendanceRecord[];
  loading: boolean;
  searchTerm: string;
  openApprovalModal: (id: number) => void;
  openDetailsModal: (id: number) => void;
}

const AttendanceTable: React.FC<AttendanceTableProps> = ({
  attendanceList,
  loading,
  searchTerm,
  openApprovalModal,
  openDetailsModal,
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600">Loading attendance data...</span>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto min-h-[300px]">
      <table className="min-w-full text-sm text-left table-auto">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="px-4 py-2 whitespace-nowrap">Employee Name</th>
            <th className="px-4 py-2 whitespace-nowrap">Jabatan</th>
            <th className="px-4 py-2 whitespace-nowrap">Clock In</th>
            <th className="px-4 py-2 whitespace-nowrap">Clock Out</th>
            <th className="px-4 py-2 whitespace-nowrap">Work Hours</th>
            <th className="px-4 py-2 whitespace-nowrap">Approve</th>
            <th className="px-4 py-2 whitespace-nowrap">Status</th>
            <th className="px-4 py-2 whitespace-nowrap">Details</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {attendanceList.length === 0 ? (
            <tr>
              <td
                colSpan={8}
                className="px-4 py-8 text-center text-gray-500"
              >
                {searchTerm ? 'No attendance data found matching your search.' : 'No attendance data found.'}
              </td>
            </tr>
          ) : (
            attendanceList.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 whitespace-nowrap">{item.name}</td>
                <td className="px-4 py-2 whitespace-nowrap">{item.position}</td>
                <td className="px-4 py-2 whitespace-nowrap">{item.clockIn}</td>
                <td className="px-4 py-2 whitespace-nowrap">{item.clockOut}</td>
                <td className="px-4 py-2 whitespace-nowrap">{item.workHours}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => openApprovalModal(item.id)}
                    className="flex items-center justify-center w-8 h-8 rounded hover:bg-gray-100"
                    aria-label="Manage approval"
                    title="Manage Approval"
                  >
                    {item.approval_status === 'approved' ? (
                      <FaCheck
                        className="w-5 h-5 text-green-600"
                        aria-label="Approved"
                      />
                    ) : item.approval_status === 'declined' ? (
                      <FaTimes
                        className="w-5 h-5 text-red-600"
                        aria-label="Declined"
                      />
                    ) : (
                      <FaTimes
                        className="w-5 h-5 text-gray-400"
                        aria-label="Pending Approval"
                      />
                    )}
                  </button>
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      item.approval_status === 'approved'
                        ? "bg-green-200 text-green-700"
                        : item.approval_status === 'declined'
                          ? "bg-red-200 text-red-700"
                          : "bg-yellow-200 text-yellow-700"
                    }`}
                  >
                    {item.approval_status === 'approved'
                      ? "Approved"
                      : item.approval_status === 'declined'
                        ? "Declined"
                        : "Pending"}
                    {item.is_manual_entry && (
                      <span className="ml-1 text-xs bg-blue-100 text-blue-600 px-1 rounded">
                        Manual
                      </span>
                    )}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => openDetailsModal(item.id)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
                    aria-label="View Details"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceTable;