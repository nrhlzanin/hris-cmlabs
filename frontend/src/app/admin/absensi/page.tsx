'use client';
import React from "react";
import { useRouter } from "next/navigation";
import { AdminNavbar } from "@/components/admin/AdminNavbar";

export default function AddCheckboxPage() {
  const router = useRouter();

  const handleCancel = () => {
    router.push('/admin/checklock');
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminNavbar />

      <div className="p-6">
        <div className="bg-white rounded shadow p-6 max-w-5xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Add Checkbox</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Select Employees</label>
                <select className="w-full border rounded px-3 py-2 mt-1">
                  <option>Choose Employee</option>
                  <option>John Doe</option>
                  <option>Jane Smith</option>
                  <option>Michael Johnson</option>
                  <option>Sarah Williams</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">Absent Type</label>
                <select className="w-full border rounded px-3 py-2 mt-1">
                  <option>Clock In</option>
                  <option>Clock Out</option>
                  <option selected>Absent</option>
                  <option>Annual Leave</option>
                  <option>Sick Leave</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Start Date</label>
                  <input type="date" className="w-full border rounded px-3 py-2 mt-1" />
                </div>
                <div>
                  <label className="block text-sm font-medium">End Date</label>
                  <input type="date" className="w-full border rounded px-3 py-2 mt-1" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Upload Supporting Evidence</label>
                <div className="border-2 border-dashed border-gray-300 p-4 rounded text-center text-gray-500">
                  <p>Drag and Drop Here</p>
                  <p className="my-2">Or</p>
                  <button className="text-blue-600 underline">Browse</button>
                </div>
              </div>
              <button className="mt-2 w-full bg-gray-200 py-2 rounded text-gray-600" disabled>
                Upload Now
              </button>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Location</label>
                <select className="w-full border rounded px-3 py-2 mt-1">
                  <option>Choose Location</option>
                </select>
              </div>
              <div className="rounded overflow-hidden shadow">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/e/e0/Malang_Satellite_Image.png"
                  alt="Map"
                  className="w-full h-52 object-cover"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Detail Address</label>
                <input
                  type="text"
                  defaultValue="Malang City, East Java"
                  className="w-full border rounded px-3 py-2 mt-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Lat</label>
                  <input
                    type="text"
                    placeholder="Lat lokasi"
                    className="w-full border rounded px-3 py-2 mt-1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Long</label>
                  <input
                    type="text"
                    placeholder="Long lokasi"
                    className="w-full border rounded px-3 py-2 mt-1"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-4 mt-6">
            <button 
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button className="px-4 py-2 bg-black text-white rounded">Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}
