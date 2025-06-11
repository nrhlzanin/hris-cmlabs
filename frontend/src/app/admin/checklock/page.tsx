'use client';

import React, { useState } from "react";
import Link from "next/link";
import { FaCheck, FaTimes, FaPlus } from "react-icons/fa";
import ApprovalModal from "@/app/components/admin/checklock/approval";
import DetailsModal from "@/app/components/admin/checklock/detailsmodal";
import { formatJakartaDate } from '@/lib/timezone';
import DashboardLayout from '@/components/layout/DashboardLayout';
import AuthWrapper from '@/components/auth/AuthWrapper';

const dummyData = [
  {
    id: 1,
    name: "Juanita",
    position: "CEO",
    clockIn: "08:00 WIB",
    clockOut: "18:30 WIB",
    workHours: "10h 30m",
    approved: null,
  },
  {
    id: 2,
    name: "Andi",
    position: "Developer",
    clockIn: "09:00 WIB",
    clockOut: "18:00 WIB",
    workHours: "9h 0m",
    approved: true,
  },
  {
    id: 3,
    name: "Sari",
    position: "Designer",
    clockIn: "08:30 WIB",
    clockOut: "17:30 WIB",
    workHours: "9h 0m",
    approved: false,
  },
];

export default function AttendanceOverview() {
  const [attendanceList, setAttendanceList] = useState(dummyData);
  const [searchTerm, setSearchTerm] = useState("");
  const [isApprovalOpen, setApprovalOpen] = useState(false);
  const [isDetailsOpen, setDetailsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const openApprovalModal = (id: number) => {
    setSelectedId(id);
    setApprovalOpen(true);
  };

  const openDetailsModal = (id: number) => {
    setSelectedId(id);
    setDetailsOpen(true);
  };

  const closeApprovalModal = () => {
    setApprovalOpen(false);
    setSelectedId(null);
  };

  const closeDetailsModal = () => {
    setDetailsOpen(false);
    setSelectedId(null);
  };

  const handleApprove = () => {
    setAttendanceList((prev) =>
      prev.map((item) =>
        item.id === selectedId ? { ...item, approved: true } : item
      )
    );
    closeApprovalModal();
  };

  const handleReject = () => {
    setAttendanceList((prev) =>
      prev.map((item) =>
        item.id === selectedId ? { ...item, approved: false } : item
      )
    );
    closeApprovalModal();
  };

  const filteredAttendance = attendanceList.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedData = attendanceList.find((item) => item.id === selectedId);
  return (
<<<<<<< HEAD
    <AuthWrapper requireAdmin={true}>
      <DashboardLayout>
        <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8 w-full">
      <div className="w-full max-w-7xl mx-auto bg-white rounded shadow p-6">
        <div className="flex justify-between items-center mb-4">
=======
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8 w-full">
      <div className="max-w-7xl mx-auto bg-white rounded shadow p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
>>>>>>> b34488116d69d94048fe117e0f0b84b5481c3319
          <h2 className="text-2xl font-semibold">Attendance Overview</h2>
          <div className="text-sm text-gray-600 text-right">
            <p>
              Today:{" "}
              {formatJakartaDate(new Date(), {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
              })}{" "}
              WIB
            </p>
            <p className="text-xs">All times shown in Jakarta timezone</p>
          </div>
        </div>

        {/* Search & Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <input
            type="text"
            placeholder="Search Employee"
            className="w-full sm:w-1/2 border rounded px-3 py-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search Employee"
          />
          <div className="flex gap-2">
            <button className="border px-4 py-2 rounded">Filter</button>
            <Link href="absensi/" passHref>
              <button
                className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                title="Add Data"
                aria-label="Add Data"
              >
                <FaPlus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Data</span>
              </button>
            </Link>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2">Employee Name</th>
                <th className="px-4 py-2">Jabatan</th>
                <th className="px-4 py-2">Clock In</th>
                <th className="px-4 py-2">Clock Out</th>
                <th className="px-4 py-2">Work Hours</th>
                <th className="px-4 py-2">Approve</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAttendance.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-4 text-center text-gray-500"
                  >
                    No attendance data found.
                  </td>
                </tr>
              ) : (
                filteredAttendance.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">{item.name}</td>
                    <td className="px-4 py-2">{item.position}</td>
                    <td className="px-4 py-2">{item.clockIn}</td>
                    <td className="px-4 py-2">{item.clockOut}</td>
                    <td className="px-4 py-2">{item.workHours}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => openApprovalModal(item.id)}
                        className="flex items-center justify-center w-8 h-8 rounded hover:bg-gray-100"
                        aria-label="Approve attendance"
                      >
                        {item.approved === null ? (
                          <FaTimes
                            className="w-5 h-5 text-gray-400"
                            aria-label="Not Approved Yet"
                          />
                        ) : item.approved ? (
                          <FaCheck
                            className="w-5 h-5 text-green-600"
                            aria-label="Approved"
                          />
                        ) : (
                          <FaTimes
                            className="w-5 h-5 text-red-600"
                            aria-label="Rejected"
                          />
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${item.approved === null
                            ? "bg-yellow-200 text-yellow-700"
                            : item.approved
                              ? "bg-green-200 text-green-700"
                              : "bg-red-200 text-red-700"
                          }`}
                      >
                        {item.approved === null
                          ? "Waiting Approval"
                          : item.approved
                            ? "On Time"
                            : "Late"}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => openDetailsModal(item.id)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
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
      </div>

      {/* Approval Modal */}
      {isApprovalOpen && selectedData && (
        <ApprovalModal
          isOpen={isApprovalOpen}
          selectedData={selectedData}
          handleApprove={handleApprove}
          handleReject={handleReject}
          closeModal={closeApprovalModal}
        />
      )}

      {/* Details Modal */}
      {isDetailsOpen && selectedData && (
        <DetailsModal
          isOpen={isDetailsOpen}
          selectedData={selectedData}
          closeModal={closeDetailsModal}        />
      )}
    </div>
      </DashboardLayout>
    </AuthWrapper>
  );
}
