"use client";

import { useState } from "react";
import Link from "next/link";

export default function OvertimeOverview() {
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const data = [
    {
      date: "August, 15 2025",
      reason: "Pak, kasih saya makan pak..",
      timeSend: "17:45:00",
      status: "Waiting Payment",
    },
    {
      date: "August, 10 2025",
      reason: "Reason",
      timeSend: "Time Send",
      status: "Approved",
    },
  ];

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Overtime Overview</h2>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Search Employee"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 border rounded-md focus:ring focus:border-blue-300"
          />
          <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Filter</button>
          <Link href="checklock/">
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center">
              <span className="text-lg mr-1">+</span> Add Data
            </button>
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Date</th>
              <th className="p-3">Reason</th>
              <th className="p-3">Time Send</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {data.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="p-3">{row.date}</td>
                <td className="p-3">{row.reason}</td>
                <td className="p-3">{row.timeSend}</td>
                <td className="p-3">
                  {row.status === "Approved" ? (
                    <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs">
                      Approved
                    </span>
                  ) : (
                    <span className="bg-yellow-400 text-white px-2 py-1 rounded-full text-xs">
                      Waiting Payment
                    </span>
                  )}
                </td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300 text-sm border border-gray-400"
                  >
                    ...
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-between items-center text-sm text-gray-500">
        <div className="flex items-center space-x-1">
          <span>Showing</span>
          <select className="border rounded px-2 py-1 text-sm">
            <option>10</option>
          </select>
          <span>out of 60 records</span>
        </div>
        <div className="flex items-center space-x-2">
          <button className="px-2 py-1 border rounded">1</button>
          <button className="px-2 py-1 border rounded bg-blue-500 text-white">2</button>
          <button className="px-2 py-1 border rounded">3</button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
            <h2 className="text-lg font-bold mb-2">Overtime Form</h2>

            <div className="mb-2">
              <p className="font-semibold">Date</p>
              <p>August, 15 2025</p>
            </div>

            <div className="mb-4">
              <p className="font-semibold mb-1">Upload Supporting Evidence</p>
              <div className="border border-dashed border-gray-400 p-6 text-center">
                <p>📷</p>
                <p>Drag and Drop Here</p>
                <p className="font-bold">Or Browse</p>
              </div>
            </div>

            <div className="mb-4">
              <p className="font-semibold mb-1">Time Sending</p>
              <p>{new Date().toLocaleTimeString()}</p>
            </div>

            <div className="mb-4">
              <p className="font-semibold mb-1">Finish or Not?</p>
              <select className="w-full border rounded px-3 py-2">
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
