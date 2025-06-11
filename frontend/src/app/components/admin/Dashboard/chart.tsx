'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from 'recharts';
import React from 'react';

const data = [
  { name: 'New', value: 15, fill: '#4299E1' },     
  { name: 'Active', value: 8, fill: '#2F855A' },   
  { name: 'Resign', value: 20, fill: '#E53E3E' },  
];

type TooltipProps = {
  active?: boolean;
  payload?: { value: number }[];
};

const CustomTooltip = ({ active, payload }: TooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black text-white text-xs px-3 py-2 rounded shadow">
        {`Value: ${payload[0].value}`}
      </div>
    );
  }
  return null;
};

export default function EmployeeBarChart() {
  return (
    <div className="rounded-xl border p-6 bg-white shadow-md">
      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="text-sm text-gray-500">Employee Statistics</p>
          <h2 className="text-lg font-semibold text-gray-800">
            Current Number of Employees
          </h2>
        </div>
        <select
          className="border border-gray-300 text-sm px-3 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
          defaultValue=""
        >
          <option value="" disabled>
            Select Month
          </option>
          <option value="june">June</option>
          <option value="may">May</option>
        </select>
      </div>

      <div className="w-full h-[250px]">
        <ResponsiveContainer>
          <BarChart data={data} barSize={40}>
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f0f0f0' }} />
            <Bar dataKey="value">
              <LabelList dataKey="value" position="top" fill="#000" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
