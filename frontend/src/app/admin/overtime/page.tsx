'use client';
import React, { useState } from "react";

const employees = [
  {
    name: "Puma Pumil",
    position: "OB",
    branch: "Bekasi",
    grade: "Management",
    status: "Waiting Payment"
  },
  {
    name: "Dika Dikut",
    position: "02 Mei 2025",
    branch: "10.000.952",
    grade: "Part Time",
    status: "Approved"
  }
];

const statusColor = {
  "Waiting Payment": "bg-yellow-400 text-white",
  Approved: "bg-green-700 text-white",
  Decline: "bg-red-700 text-white",
  "Waiting Approval": "bg-yellow-500 text-white"
};

const detailData = [
  {
    no: 1,
    date: "August, 15 2025",
    action: (
      <div className="flex gap-1 justify-center">
        <span className="bg-green-600 text-white px-2 py-1 rounded">✔</span>
        <span className="bg-red-600 text-white px-2 py-1 rounded">✘</span>
      </div>
    ),
    detail: "Kasih saya makan pak, tolong pak..."
  },
  {
    no: 2,
    date: "August, 10 2025",
    action: <span className="bg-yellow-400 text-white px-2 py-1 rounded">Done</span>,
    detail: ""
  },
  {
    no: 3,
    date: "August, 05 2025",
    action: <span className="bg-red-500 text-white px-2 py-1 rounded">Decline</span>,
    detail: ""
  },
  {
    no: 4,
    date: "July, 19 2025",
    action: <span className="bg-green-600 text-white px-2 py-1 rounded">Accepted</span>,
    detail: ""
  },
  {
    no: 5,
    date: "June, 20 2025",
    action: null,
    detail: ""
  },
  {
    no: 6,
    date: "September, 30 2024",
    action: null,
    detail: ""
  }
];

export default function OvertimeOverview() {
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);

  const filteredEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold mr-4">Overtime Overview</h1>
          <input
            type="text"
            placeholder="Search Employee"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 w-64 mr-2"
          />
          <button className="border border-gray-300 rounded px-4 py-2 mr-2">Filter</button>
          <button
            onClick={() => setFormModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Data
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2 text-left">Employee Name</th>
                <th className="border px-4 py-2 text-left">Position</th>
                <th className="border px-4 py-2 text-left">Branch</th>
                <th className="border px-4 py-2 text-left">Grade</th>
                <th className="border px-4 py-2 text-left">Status</th>
                <th className="border px-4 py-2 text-left">Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((emp, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border px-4 py-2 flex items-center gap-2">
                    <div className="bg-gray-300 w-8 h-8 rounded-full" />
                    {emp.name}
                  </td>
                  <td className="border px-4 py-2">{emp.position}</td>
                  <td className="border px-4 py-2">{emp.branch}</td>
                  <td className="border px-4 py-2">{emp.grade}</td>
                  <td className="border px-4 py-2">
                    <span className={`px-2 py-1 rounded-full text-sm ${statusColor[emp.status]}`}>
                      {emp.status}
                    </span>
                  </td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => setModalOpen(true)}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-3xl max-h-[90%] overflow-y-auto relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-2 right-4 text-red-600 text-2xl font-bold"
            >
              ×
            </button>
            <h2 className="text-lg font-semibold mb-4">Overtime History</h2>
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-4 py-2">No</th>
                  <th className="border px-4 py-2">Date</th>
                  <th className="border px-4 py-2">Action</th>
                  <th className="border px-4 py-2">Detail</th>
                </tr>
              </thead>
              <tbody>
                {detailData.map((item) => (
                  <tr key={item.no}>
                    <td className="border px-4 py-2 text-center">{item.no}</td>
                    <td className="border px-4 py-2">{item.date}</td>
                    <td className="border px-4 py-2 text-center">{item.action}</td>
                    <td className="border px-4 py-2">{item.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {formModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md overflow-y-auto relative">
            <button
              onClick={() => setFormModalOpen(false)}
              className="absolute top-2 right-4 text-red-600 text-2xl font-bold"
            >
              ×
            </button>
            <h2 className="text-lg font-semibold mb-4">Overtime Form</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">End Time</label>
                <input
                  type="time"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Upload Supporting Evidence
                </label>
                <div className="border-dashed border-2 border-gray-300 p-4 text-center rounded-md">
                  <p className="text-gray-500 mb-2">Drag and Drop Here</p>
                  <p className="text-blue-600 font-semibold cursor-pointer">Or Browse</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Finish or Not?</label>
                <input
                  type="text"
                  placeholder="Enter Content For The Letter Type"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
