'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';

const employees = [
  { id: 1, name: 'Johan', status: 'On Time', time: '08.00', color: 'bg-green-600' },
  { id: 2, name: 'Timothy Moore', status: 'Izin', time: '09.00', color: 'bg-yellow-500' },
  { id: 3, name: 'Bob Doe', status: 'Late', time: '08.15', color: 'bg-red-500' },
];

export default function EmployeeStatusCard() {
  return (
    <Card className="rounded-xl border p-6 bg-white shadow-md">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <h2 className="font-bold text-xl text-gray-800">Employee Status Overview</h2>
          <Select>
            <SelectTrigger className="w-[160px] border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
              <SelectValue placeholder="Select Month" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="june">June</SelectItem>
              <SelectItem value="may">May</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-6 text-sm text-gray-600 mb-6 flex-wrap justify-center sm:justify-start">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-600"></span>
            <span><strong className="text-black">142</strong> On Time</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            <span><strong className="text-black">4</strong> Late</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-gray-500"></span>
            <span><strong className="text-black">9</strong> Absent</span>
          </div>
        </div>

        <div className="overflow-x-auto" style={{ aspectRatio: '16 / 9' }}>
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead className="text-gray-700">No</TableHead>
                <TableHead className="text-gray-700">Name</TableHead>
                <TableHead className="text-gray-700">Attendance Status</TableHead>
                <TableHead className="text-gray-700">Check In</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((emp) => (
                <TableRow key={emp.id} className="hover:bg-gray-50">
                  <TableCell>{emp.id}</TableCell>
                  <TableCell>{emp.name}</TableCell>
                  <TableCell>
                    <span className={`text-white text-xs font-semibold px-3 py-1 rounded-full ${emp.color}`}>
                      {emp.status}
                    </span>
                  </TableCell>
                  <TableCell>{emp.time}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}