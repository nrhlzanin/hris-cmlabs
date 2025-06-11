'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  Cell,
} from 'recharts';

const data = [
  { name: 'Tetap Permanen', value: 23, fill: '#16A34A' },
  { name: 'Tetap Percobaan', value: 46, fill: '#FACC15' },
  { name: 'PKWT (Kontrak)', value: 64, fill: '#3B82F6' },
  { name: 'Magang', value: 75, fill: '#EF4444' },
];

export default function EmployeeStatusChart() {
  return (
    <div className="rounded-xl border p-6 bg-white shadow-md">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
        <div>
          <p className="text-sm text-gray-500">Employee Statistics</p>
          <h2 className="text-xl font-bold text-gray-800">Employee Status</h2>
        </div>
        <select className="border border-gray-300 text-sm rounded-md px-3 py-1 focus:outline-none focus:ring focus:ring-blue-300">
          <option>Select Month</option>
          <option value="june">June</option>
          <option value="may">May</option>
        </select>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart layout="vertical" data={data} margin={{ top: 10, right: 30, left: 40, bottom: 10 }}>
          <XAxis type="number" domain={[0, 100]} hide />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 13, fill: '#374151' }}
            width={150}
          />
          <Tooltip contentStyle={{ fontSize: '12px' }} />
          <Bar dataKey="value">
            <LabelList dataKey="value" position="right" fill="#111827" fontSize={12} />
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
