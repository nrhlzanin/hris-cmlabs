import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Ontime", value: 142 },
  { name: "Late", value: 34 },
  { name: "Absent", value: 9 },
];

const COLORS = ["#255F2D", "#59B4F0", "#B91C1C"];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central">
      {(percent * 100).toFixed(2)}%
    </text>
  );
};

export default function AttendancePieChart() {
  return (
    <div className="flex flex-col md:flex-row p-4 rounded-xl shadow-md border w-full max-w-4xl bg-white">
      <div className="w-full md:w-1/2 h-64">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={80}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="w-full md:w-1/2 flex flex-col justify-center px-4">
        <div className="text-sm text-gray-500 font-semibold">Statistics <span className="float-right font-normal">Today</span></div>
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-[#255F2D] mr-2"></div>
              <span>Ontime</span>
            </div>
            <span>142</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-[#59B4F0] mr-2"></div>
              <span>Late</span>
            </div>
            <span>34</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-[#B91C1C] mr-2"></div>
              <span>Absent</span>
            </div>
            <span>9</span>
          </div>
        </div>
        <div className="text-xs text-gray-400 mt-2">tgl bulan thn</div>
      </div>
    </div>
  );
}
