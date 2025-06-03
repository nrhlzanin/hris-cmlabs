import Image from 'next/image';

export default function ChecklockOverview() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Checklock Overview</h2>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Search Employee"
              className="px-3 py-2 border rounded-md focus:ring focus:border-blue-300"
            />
            <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Filter</button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              + Add Data
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">Date</th>
                <th className="p-2">Clock In</th>
                <th className="p-2">Clock Out</th>
                <th className="p-2">Work Hours</th>
                <th className="p-2 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr>
                <td className="p-2">March 01, 2025</td>
                <td className="p-2">09:28 AM</td>
                <td className="p-2">04:00 PM</td>
                <td className="p-2">10h 5m</td>
                <td className="p-2 text-center">
                  <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs">
                    On Time
                  </span>
                </td>
              </tr>
              <tr>
                <td className="p-2">March 02, 2025</td>
                <td className="p-2">09:30 AM</td>
                <td className="p-2">04:30 PM</td>
                <td className="p-2">8h 50m</td>
                <td className="p-2 text-center">
                  <span className="bg-red-600 text-white px-2 py-1 rounded-full text-xs">
                    Late
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
          <div>
            Showing
            <select className="border rounded px-1 py-0.5 ml-1">
              <option>10</option>
            </select>
            out of 60 records
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-2 py-1 border rounded">1</button>
            <button className="px-2 py-1 border rounded bg-blue-500 text-white">2</button>
            <button className="px-2 py-1 border rounded">3</button>
          </div>
        </div>
      </div>
    </div>
  );
}
//