"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AlarmClock, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

const iconMap = {
  "Work Hours": <AlarmClock className="text-blue-500" />,
  "On Time": <CheckCircle className="text-green-500" />,
  "Late": <AlertTriangle className="text-yellow-500" />,
  "Absent": <XCircle className="text-red-500" />,
};

const mockData = [
  { title: "Work Hours", value: "120h 54m" },
  { title: "On Time", value: 20 },
  { title: "Late", value: 5 },
  { title: "Absent", value: 10 },
];

export default function AttendanceDashboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Simulate data fetching delay
    const timer = setTimeout(() => {
      setData(mockData);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4">
      {data.map((item, index) => (
        <Card key={index}>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="text-2xl">{iconMap[item.title] || <AlarmClock />}</div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{item.title}</p>
              <p className="text-2xl font-bold">{item.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
