'use client';

import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { name: 'Ontime', value: 142 },
  { name: 'Late', value: 34 },
  { name: 'Absent', value: 9 },
];

const COLORS = ['#16A34A', '#3B82F6', '#EF4444'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" fontSize={12} textAnchor="middle" dominantBaseline="central">
      {(percent * 100).toFixed(0)}%
    </text>
  );
};

export default function AttendancePieChart() {
  return (
    <div className="flex rounded-xl border p-6 bg-white shadow-md">
      <div className="w-full md:w-1/2 h-64">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={90}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ fontSize: '12px' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="w-full md:w-1/2 flex flex-col justify-center px-6">
        <div className="text-sm text-gray-700 font-semibold mb-2">
          Attendance Statistics <span className="float-right font-normal text-gray-500">Today</span>
        </div>
        <div className="space-y-3 mt-4 text-sm">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-[#16A34A] mr-2"></div>
              <span className="text-gray-700">Ontime</span>
            </div>
            <span className="font-medium text-gray-900">142</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-[#3B82F6] mr-2"></div>
              <span className="text-gray-700">Late</span>
            </div>
            <span className="font-medium text-gray-900">34</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-[#EF4444] mr-2"></div>
              <span className="text-gray-700">Absent</span>
            </div>
            <span className="font-medium text-gray-900">9</span>
          </div>
        </div>
        <div className="text-xs text-gray-400 mt-6">Updated June 11, 2025</div>
      </div>
    </div>
  );
}
