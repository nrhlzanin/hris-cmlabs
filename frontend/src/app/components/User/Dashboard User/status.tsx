import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

const employees = [
  { id: 1, name: 'Johan', status: 'On Time', time: '08.00', color: 'bg-green-700' },
  { id: 2, name: 'Timothy Moore', status: 'Izin', time: '09.00', color: 'bg-yellow-500' },
  { id: 3, name: 'Bob Doe', status: 'Late', time: '08.15', color: 'bg-red-600' },
];

export default function EmployeeStatusCard() {
  return (
    <Card className="w-full max-w-3xl mx-auto mt-8">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg">Employee Status</h2>
          <Select>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select Month" />
            </SelectTrigger>
          </Select>
        </div>

        <div className="flex gap-6 text-sm mb-4">
          <span><strong>142</strong> On time</span>
          <span><strong>4</strong> Late</span>
          <span><strong>9</strong> Absent</span>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Status Kehadiran</TableHead>
              <TableHead>Check In</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((emp) => (
              <TableRow key={emp.id}>
                <TableCell>{emp.id}</TableCell>
                <TableCell>{emp.name}</TableCell>
                <TableCell>
                  <span className={`text-white text-xs px-3 py-1 rounded-full ${emp.color}`}>
                    {emp.status}
                  </span>
                </TableCell>
                <TableCell>{emp.time}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
