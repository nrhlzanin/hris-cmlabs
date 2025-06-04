'use client';
import React, { useState } from "react";
import Link from "next/link";

const dummyData = [
  {
    id: 1,
    name: "Juanita",
    position: "CEO",
    clockIn: "08.00",
    clockOut: "18.30",
    workHours: "10h 30m",
    approved: null,
  },
  // nanti bisa tambah data lain
];

export default function AttendanceOverview() {
  const [attendanceList, setAttendanceList] = useState(dummyData);
  const [isApprovalOpen, setApprovalOpen] = useState(false);
  const [isDetailsOpen, setDetailsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // buka modal approve dengan pilih row
  const openApprovalModal = (id) => {
    setSelectedId(id);
    setApprovalOpen(true);
  };

  // buka modal details dengan pilih row
  const openDetailsModal = (id) => {
    setSelectedId(id);
    setDetailsOpen(true);
  };

  // approve attendance by id
  const handleApprove = () => {
    setAttendanceList((prev) =>
      prev.map((item) =>
        item.id === selectedId ? { ...item, approved: true } : item
      )
    );
    setApprovalOpen(false);
  };

  // reject attendance by id
  const handleReject = () => {
    setAttendanceList((prev) =>
      prev.map((item) =>
        item.id === selectedId ? { ...item, approved: false } : item
      )
    );
    setApprovalOpen(false);
  };

  // cari data yg dipilih untuk details modal
  const selectedData = attendanceList.find((item) => item.id === selectedId);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-6 rounded shadow-lg max-w-6xl mx-auto">
        <div className="flex justify-between mb-4">
          <h2 className="text-2xl font-semibold">Checklock Overview</h2>
          <div className="flex gap-2">
            <button className="border px-4 py-2 rounded">Filter</button>
            <Link href="absensi/">
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                + Add Data
              </button>
            </Link>
          </div>
        </div>

        <input
          type="text"
          placeholder="Search Employee"
          className="w-full border rounded px-3 py-2 mb-4"
        />

        <table className="min-w-full text-sm text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2">Employee Name</th>
              <th className="px-4 py-2">Jabatan</th>
              <th className="px-4 py-2">Clock In</th>
              <th className="px-4 py-2">Clock Out</th>
              <th className="px-4 py-2">Work Hours</th>
              <th className="px-4 py-2">Approve</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {attendanceList.map((item) => (
              <tr key={item.id}>
                <td className="px-4 py-2">{item.name}</td>
                <td className="px-4 py-2">{item.position}</td>
                <td className="px-4 py-2">{item.clockIn}</td>
                <td className="px-4 py-2">{item.clockOut}</td>
                <td className="px-4 py-2">{item.workHours}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => openApprovalModal(item.id)}
                    className="flex items-center gap-2"
                    aria-label="Approve attendance"
                  >
                    {item.approved === null ? (
                      <img
                        src="/icons/cross.svg"
                        alt="not approved"
                        className="w-5 h-5"
                      />
                    ) : item.approved ? (
                      <img
                        src="/icons/check.svg"
                        alt="approved"
                        className="w-5 h-5"
                      />
                    ) : (
                      <img
                        src="/icons/cross.svg"
                        alt="rejected"
                        className="w-5 h-5"
                      />
                    )}
                  </button>
                </td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      item.approved === null
                        ? "bg-yellow-200 text-yellow-800"
                        : item.approved
                        ? "bg-green-200 text-green-800"
                        : "bg-red-200 text-red-800"
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
                    className="bg-blue-500 text-white px-3 py-1 rounded text-xs"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Approval Modal */}
      {isApprovalOpen && selectedData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-start">
              <div className="flex gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-900"></div>
                <div>
                  <h2 className="text-lg font-semibold">Approve Attendance</h2>
                  <p className="text-sm text-gray-600">
                    Are you sure want to approve {selectedData.name}'s
                    attendance?
                    <br />
                    This action cannot be undone.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setApprovalOpen(false)}
                className="text-gray-600 hover:text-black text-xl font-bold"
                aria-label="Close modal"
              >
                &times;
              </button>
            </div>
            <div className="mt-6 flex justify-center gap-4">
              <button
                onClick={handleReject}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg"
              >
                Reject
              </button>
              <button
                onClick={handleApprove}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {isDetailsOpen && selectedData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Attendance Details</h2>
              <button
                onClick={() => setDetailsOpen(false)}
                className="text-gray-600 hover:text-black text-2xl font-bold"
                aria-label="Close modal"
              >
                &times;
              </button>
            </div>

            {/* Profile */}
            <div className="flex items-center justify-between border rounded p-4 mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-800 rounded-full"></div>
                <div>
                  <div className="font-semibold">{selectedData.name}</div>
                  <div className="text-sm text-gray-600">{selectedData.position}</div>
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded text-xs ${
                  selectedData.approved === null
                    ? "bg-yellow-200 text-yellow-800"
                    : selectedData.approved
                    ? "bg-green-200 text-green-800"
                    : "bg-red-200 text-red-800"
                }`}
              >
                {selectedData.approved === null
                  ? "Waiting Approval"
                  : selectedData.approved
                  ? "On Time"
                  : "Late"}
              </span>
            </div>

            {/* Info */}
            <div className="grid grid-cols-2 gap-4 mb-4 border rounded p-4">
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-semibold">1 March 2025</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Check In</p>
                <p className="font-semibold">{selectedData.clockIn}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Check Out</p>
                <p className="font-semibold">{selectedData.clockOut}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-semibold">
                  {selectedData.approved === null
                    ? "Pending"
                    : selectedData.approved
                    ? "Present"
                    : "Absent"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Work Hours</p>
                <p className="font-semibold">{selectedData.workHours}</p>
              </div>
            </div>

            {/* Location */}
            <div className="border rounded p-4 mb-4">
              <h3 className="font-semibold mb-2">Location Information</h3>
              <p>
                <strong>Location:</strong> Office
              </p>
              <p>
                <strong>Detail Address:</strong> Jln. Soekarno Hatta No. 8, Jatimulyo,
                Lowokwaru, Kota Malang.
              </p>
              <p>
                <strong>Lat:</strong> -2241720016
              </p>
              <p>
                <strong>Long:</strong> 2241720119
              </p>
            </div>

            {/* Proof */}
            <div className="border rounded p-4">
              <h3 className="font-semibold mb-2">Proof of Attendance</h3>
              <div className="flex items-center gap-2">
                <span>Wa003198373738.img</span>
                <button className="text-blue-600 hover:underline text-sm">
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
