'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const AttendanceSummary: React.FC = () => {
  const [series, setSeries] = useState([20, 5, 3, 2]);

  const options: ApexOptions = {
    chart: {
      type: 'donut',
    },
    plotOptions: {
      pie: {
        donut: {
          size: '85%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total',
              formatter: () => 'Presensi',
              color: '#373d3f'
            }
          }
        }
      }
    },
    labels: ['Present', 'Permit', 'Leave', 'Sick'],
    colors: ['#16a34a', '#2563eb', '#dc2626', '#f97316'],
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: false,
    },
  };

  const legendItems = [
    { color: 'bg-green-700', label: 'Present' },
    { color: 'bg-blue-500', label: 'Permit' },
    { color: 'bg-red-700', label: 'Leave' },
    { color: 'bg-yellow-700', label: 'Sick' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-2 md:p-4 border-b flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Attendance Summary</h3>
        <select className="border-none text-sm text-gray-600 focus:ring-0 bg-transparent">
          <option>This Month</option>
          <option>Last Month</option>
          <option>This Year</option>
        </select>
      </div>

      <div className="p-2 md:p-4">
        <div className="w-full aspect-square flex justify-center items-center">
          <Chart options={options} series={series} type="donut" width={220} />
        </div>
      </div>
      
      <div className="p-2 md:p-4 border-t grid grid-cols-2 md:grid-cols-4 gap-4">
        {legendItems.map(item => (
          <div key={item.label} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
            <span className="text-sm text-gray-700">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttendanceSummary;