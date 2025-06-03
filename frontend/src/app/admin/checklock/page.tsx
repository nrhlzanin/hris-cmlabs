import React, { useState } from "react";

export default function AttendanceOverview() {
  const [isApprovalOpen, setApprovalOpen] = useState(false);
  const [isDetailsOpen, setDetailsOpen] = useState(false);
  const [approved, setApproved] = useState(null);

  const handleApprove = () => {
    setApproved(true);
    setApprovalOpen(false);
  };

  const handleReject = () => {
    setApproved(false);
    setApprovalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-6 rounded shadow-lg max-w-6xl mx-auto">
        <div className="flex justify-between mb-4">
          <h2 className="text-2xl font-semibold">Checklock Overview</h2>
          <div className="flex gap-2">
            <button className="border px-4 py-2 rounded">Filter</button>
            <button className="bg-blue-500 text-white px-4 py-2 rounded">+ Add Data</button>
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
            <tr>
              <td className="px-4 py-2">Juanita</td>
              <td className="px-4 py-2">CEO</td>
              <td className="px-4 py-2">08.00</td>
              <td className="px-4 py-2">18.30</td>
              <td className="px-4 py-2">10h 30m</td>
              <td className="px-4 py-2">
                <button onClick={() => setApprovalOpen(true)} className="flex items-center gap-2">
                  {!approved ? (
                    <img src="/icons/cross.svg" alt="no" className="w-5 h-5" />
                  ) : (
                    <img src="/icons/check.svg" alt="yes" className="w-5 h-5" />
                  )}
                </button>
              </td>
              <td className="px-4 py-2">
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    approved === null
                      ? "bg-yellow-200 text-yellow-800"
                      : approved
                      ? "bg-green-200 text-green-800"
                      : "bg-red-200 text-red-800"
                  }`}
                >
                  {approved === null ? "Waiting Approval" : approved ? "On Time" : "Late"}
                </span>
              </td>
              <td className="px-4 py-2">
                <button
                  onClick={() => setDetailsOpen(true)}
                  className="bg-blue-500 text-white px-3 py-1 rounded text-xs"
                >
                  View
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Approval Modal */}
      {isApprovalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-start">
              <div className="flex gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-900"></div>
                <div>
                  <h2 className="text-lg font-semibold">Approve Attendance</h2>
                  <p className="text-sm text-gray-600">
                    Are you sure want to approve this employee's attendance?<br />
                    This action cannot be undone.
                  </p>
                </div>
              </div>
              <button onClick={() => setApprovalOpen(false)} className="text-gray-600 hover:text-black text-xl font-bold">
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
      {isDetailsOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Attendance Details</h2>
              <button
                onClick={() => setDetailsOpen(false)}
                className="text-gray-600 hover:text-black text-2xl font-bold"
              >
                &times;
              </button>
            </div>

            {/* Profile */}
            <div className="flex items-center justify-between border rounded p-4 mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-800 rounded-full"></div>
                <div>
                  <div className="font-semibold">Nama Lengkap</div>
                  <div className="text-sm text-gray-600">Jabatan</div>
                </div>
              </div>
              <span className="bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded">Status Approve</span>
            </div>

            {/* Info */}
            <div className="grid grid-cols-2 gap-4 mb-4 border rounded p-4">
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-semibold">1 March 2025</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Check In</p>
                <p className="font-semibold">09.00</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Check Out</p>
                <p className="font-semibold">15.00</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-semibold">Present</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Work Hours</p>
                <p className="font-semibold">9 Hours</p>
              </div>
            </div>

            {/* Location */}
            <div className="border rounded p-4 mb-4">
              <h3 className="font-semibold mb-2">Location Information</h3>
              <p>
                <strong>Location:</strong> Office
              </p>
              <p>
                <strong>Detail Address:</strong> Jln. Soekarno Hatta No. 8, Jatimulyo, Lowokwaru, Kota Malang.
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
                <button className="text-blue-600 hover:underline text-sm">Download</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
