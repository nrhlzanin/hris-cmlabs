'use client';
import React, { useState } from 'react';
import DetailModal from '@/app/components/admin/overtime/detailmodal';
import FormModal from '@/app/components/admin/overtime/formmodal';
import { Employee, Detail } from './types';

const employees: Employee[] = [
  { id: 1, name: 'Puma Pumil', position: 'OB', branch: 'Bekasi', grade: 'Management', status: 'Waiting Approval' },
  { id: 2, name: 'Dika Dikut', position: '02 Mei 2025', branch: '10.000.952', grade: 'Part Time', status: 'Approved' },
  { id: 3, name: 'Anin Pulu-Pulu', position: '02 Mei 2025', branch: '10.000.952', grade: 'Part Time', status: 'Decline' },
  { id: 4, name: 'Febi Jogijay', position: '02 Mei 2025', branch: '10.000.952', grade: 'Part Time', status: 'Waiting Approval' },
  { id: 5, name: 'Puma Pumil', position: '02 Mei 2025', branch: '10.000.952', grade: 'Part Time', status: 'Waiting Approval' },
  { id: 6, name: 'Dika Dikut', position: '02 Mei 2025', branch: '10.000.952', grade: 'Part 99Time', status: 'Waiting Approval' },
];

const statusColor: Record<Employee['status'], string> = {
  'Waiting Payment': 'bg-yellow-100 text-yellow-800',
  Approved: 'bg-green-100 text-green-800',
  Decline: 'bg-red-100 text-red-800',
  'Waiting Approval': 'bg-orange-100 text-orange-800',
};

const detailData: Detail[] = [
  { no: 1, date: 'August, 15 2025', action: <div className="flex gap-1 justify-center"><span className="bg-green-600 text-white px-2 py-1 rounded">✔</span><span className="bg-red-600 text-white px-2 py-1 rounded">✘</span></div>, detail: 'Mengerjakan laporan bulanan.' },
  { no: 2, date: 'August, 10 2025', action: <span className="bg-yellow-400 text-white px-2 py-1 rounded">Done</span>, detail: 'Meeting dengan klien.' },
  { no: 3, date: 'August, 05 2025', action: <span className="bg-red-500 text-white px-2 py-1 rounded">Decline</span>, detail: '' },
  { no: 4, date: 'July, 19 2025', action: <span className="bg-green-600 text-white px-2 py-1 rounded">Accepted</span>, detail: '' },
];

export default function OvertimeOverview() {
  const [search, setSearch] = useState<string>('');
  const [detailModalOpen, setDetailModalOpen] = useState<boolean>(false);
  const [formModalOpen, setFormModalOpen] = useState<boolean>(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const filteredEmployees = employees.filter((emp) => emp.name.toLowerCase().includes(search.toLowerCase()));

  const handleViewDetails = (employee: Employee) => {
    setSelectedEmployee(employee);
    setDetailModalOpen(true);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
            <h1 className="text-2xl font-bold text-gray-800">Overtime Overview</h1>
            <div className="flex flex-wrap gap-2 items-center">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
                <input type="text" placeholder="Search Employee" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              <button className="border px-4 py-2 rounded-lg bg-white hover:bg-gray-100">Filter</button>
              <button onClick={() => setFormModalOpen(true)} className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">Add Data</button>
            </div>
          </div>

          <div className="overflow-x-auto bg-white rounded-xl shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr className="text-gray-600 text-sm">
                  <th className="px-6 py-4 text-left">Employee Name</th>
                  <th className="px-6 py-4 text-left">Position</th>
                  <th className="px-6 py-4 text-left">Branch</th>
                  <th className="px-6 py-4 text-left">Grade</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-center">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                        <div>
                          <div className="font-semibold text-gray-800">{emp.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{emp.position}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{emp.branch}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{emp.grade}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor[emp.status]}`}>{emp.status}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button onClick={() => handleViewDetails(emp)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs hover:bg-blue-700">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="p-4 flex justify-between items-center text-sm text-gray-600">
              <span>Showing 1 to {filteredEmployees.length} out of 60 records</span>
              <div className="flex items-center gap-2">
                <button className="px-2 py-1 rounded bg-gray-200 text-gray-600" disabled>{'<'}</button>
                <span>1</span>
                <button className="px-2 py-1 rounded bg-gray-200 text-gray-600" disabled>{'>'}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <DetailModal isOpen={detailModalOpen} onClose={() => setDetailModalOpen(false)} data={detailData} employee={selectedEmployee} />
      <FormModal isOpen={formModalOpen} onClose={() => setFormModalOpen(false)} />
    </>
  );
}