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
  { name: 'Tetap Permanen', value: 23, fill: '#2ecc71' },
  { name: 'Tetap Percobaan', value: 46, fill: '#f39c12' },
  { name: 'PKWT (Kontrak)', value: 64, fill: '#5dade2' },
  { name: 'Magang', value: 75, fill: '#c0392b' },
];

export default function EmployeeStatusChart() {
  return (
    <div className="bg-white rounded-xl shadow p-6 w-full max-w-xl">
      <h2 className="text-sm text-gray-600">Employee Statistics</h2>
      <h1 className="text-xl font-bold mb-4">Employee Status</h1>

      <div className="flex justify-end mb-2">
        <select className="border rounded px-3 py-1 text-sm">
          <option>Select Month</option>
        </select>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart layout="vertical" data={data} margin={{ left: 40 }}>
          <XAxis type="number" domain={[0, 150]} hide />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 14 }}
            width={130}
          />
          <Tooltip />
          <Bar dataKey="value">
            <LabelList dataKey="value" position="right" />
            {data.map((entry, index) => (
              <Bar key={index} dataKey="value" fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
