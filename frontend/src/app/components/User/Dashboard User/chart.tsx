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

const data = [
  { name: 'New', value: 15, fill: '#4299E1' },     // Blue
  { name: 'Active', value: 8, fill: '#2F855A' },   // Green
  { name: 'Resign', value: 20, fill: '#E53E3E' },  // Red
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        backgroundColor: '#000',
        color: '#fff',
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '12px'
      }}>
        {payload[0].value}
      </div>
    );
  }
  return null;
};

export default function EmployeeBarChart() {
  return (
    <div className="rounded-xl border p-4 bg-white shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-600">Employee Statistics</p>
          <h2 className="text-xl font-bold">Current Number of Employees</h2>
        </div>
        <select className="border text-sm px-2 py-1 rounded-md">
          <option>Select Month</option>
          <option>June</option>
          <option>May</option>
        </select>
      </div>

      <div className="mt-4" style={{ width: '100%', height: 250 }}>
        <ResponsiveContainer>
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value">
              <LabelList dataKey="value" position="top" fill="#000" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
