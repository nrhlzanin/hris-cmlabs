import React from 'react';

export default function EmployeeTable() {
  const employees = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    name: `Nama ${i + 1}`,
    gender: (i + 1) % 2 === 0 ? 'Men' : 'Woman',
    phone: `0812803310${i + 1}`,
    branch: 'Jakarta',
    position: 'Staff',
    grade: 'Lead',
    status: (i + 1) % 3 !== 0
  }));

  return (
    <div className="px-6 py-10">
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">All Employees Information</h2>
          <div className="flex space-x-2">
            <input type="text" placeholder="Search Employee" className="px-3 py-2 border rounded-md focus:ring focus:border-blue-300" />
            <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Filter</button>
            <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Import</button>
            <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Export</button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">+ Add Data</button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">No.</th>
                <th className="p-2">Avatar</th>
                <th className="p-2">Nama</th>
                <th className="p-2">Jenis Kelamin</th>
                <th className="p-2">Nomor Telepon</th>
                <th className="p-2">Cabang</th>
                <th className="p-2">Jabatan</th>
                <th className="p-2">Grade</th>
                <th className="p-2">Status</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {employees.map(emp => (
                <tr key={emp.id}>
                  <td className="p-2">{emp.id}</td>
                  <td className="p-2">
                    <div className="w-8 h-8 rounded-full bg-blue-800"></div>
                  </td>
                  <td className="p-2">{emp.name}</td>
                  <td className="p-2">
                    <span className={`px-2 py-1 rounded-full text-white ${emp.gender === 'Men' ? 'bg-blue-500' : 'bg-rose-500'}`}>
                      {emp.gender}
                    </span>
                  </td>
                  <td className="p-2">{emp.phone}</td>
                  <td className="p-2">{emp.branch}</td>
                  <td className="p-2">{emp.position}</td>
                  <td className="p-2">{emp.grade}</td>
                  <td className="p-2">
                    <label className="inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked={emp.status} />
                      <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:bg-blue-500 relative after:content-[''] after:absolute after:left-1 after:top-1 after:bg-white after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:after:translate-x-5"></div>
                    </label>
                  </td>
                  <td className="p-2 flex space-x-2">
                    <button className="p-1 bg-green-500 hover:bg-green-600 text-white rounded">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12H9m4 4H9m1-8H9m13 5a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </button>
                    <button className="p-1 bg-yellow-400 hover:bg-yellow-500 text-white rounded">✎</button>
                    <button className="p-1 bg-red-500 hover:bg-red-600 text-white rounded">🗑</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
          <div>Showing <select className="border rounded px-1 py-0.5 ml-1"><option>10</option></select> out of 60 records</div>
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
