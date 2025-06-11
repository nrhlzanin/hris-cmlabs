import React from "react";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";

const data = [
  { name: "Present", value: 60 },
  { name: "Pemit", value: 20 },
  { name: "Leave", value: 10 },
  { name: "Sick", value: 10 },
];

const COLORS = ["#1E7D3F", "#3BA3F2", "#A6231D", "#F5A700"];

export default function AttendanceSummary() {
  return (
    <div className="w-full max-w-md mx-auto p-4 bg-white shadow rounded-2xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Attendance Summary</h2>
        <select className="border p-1 rounded text-sm">
          <option>months</option>
        </select>
      </div>
      <div className="w-full h-64">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <p className="text-xl font-semibold">Total</p>
            <p className="text-xl font-semibold">Presensi</p>
          </div>
        </div>
      </div>
      <div className="flex justify-around mt-6">
        {data.map((item, index) => (
          <div key={item.name} className="flex items-center space-x-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: COLORS[index] }}
            ></div>
            <span className="text-sm">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
