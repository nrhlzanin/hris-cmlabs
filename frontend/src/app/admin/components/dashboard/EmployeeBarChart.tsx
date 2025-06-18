'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  Cell,
  CartesianGrid 
} from 'recharts';
import React from 'react';

const data = [
  { name: 'New', value: 16, fill: '#3B82F6' },
  { name: 'Active', value: 7, fill: '#10B981' },
  { name: 'Resign', value: 20, fill: '#EF4444' },
];

type TooltipProps = {
  active?: boolean;
  payload?: { value: number }[];
};

const CustomTooltip = ({ active, payload }: TooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg">
        {`${payload[0].value}`}
      </div>
    );
  }
  return null;
};

const CustomYAxisTick = (props: any) => {
  const { x, y, payload } = props;
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={-4} textAnchor="end" fill="#6B7280" fontSize={12}>
        {payload.value === 0 ? '' : payload.value}
      </text>
    </g>
  );
};

const CustomLabel = (props: any) => {
  const { x, y, value } = props;
  return (
    <g transform={`translate(${x},${y})`}>
      <rect x={-15} y={-22} width={30} height={18} rx={4} ry={4} fill="#1F2937" />
      <text x={0} y={-10} fill="#fff" textAnchor="middle" dominantBaseline="middle" fontSize={11}>
        {value}
      </text>
    </g>
  );
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

      <div className="w-full h-[250px] md:h-[300px]">
        <ResponsiveContainer>
          <BarChart
            data={data}
            margin={{
              top: 30, right: 10, left: 0, bottom: 5,
            }}
            barCategoryGap="20%"
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
            <YAxis
              domain={[0, 30]}
              tickCount={4}
              axisLine={false}
              tickLine={false}
              tick={<CustomYAxisTick />}
              interval="preserveStartEnd"
              width={30}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
              <LabelList dataKey="value" position="top" content={<CustomLabel />} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}