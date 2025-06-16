'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const formatHoursTooltip = (decimalHours: number): string => {
  const hours = Math.floor(decimalHours);
  const minutes = Math.round((decimalHours - hours) * 60);
  return `${hours}hr ${minutes}m`;
};

const WorkHoursChart: React.FC = () => {
  const [series, setSeries] = useState([
    {
      name: 'Work Hours',
      data: [8.0, 1.5, 3.75, 2.2, 6.71, 1.5, 4.2],
    },
  ]);

  const options: ApexOptions = {
    chart: {
      type: 'bar',
      height: 250,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: '40%',
        horizontal: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: ['March 20', 'March 21', 'March 22', 'March 23', 'March 24', 'March 25', 'March 26'],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: '#6b7280',
          fontSize: '12px',
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: '#6b7280',
          fontSize: '12px',
        },
        formatter: (val) => `${val} hr`,
      },
    },
    fill: {
      opacity: 1,
      colors: ['#3b82f6'],
    },
    grid: {
      borderColor: '#e5e7eb',
      strokeDashArray: 4,
      yaxis: {
        lines: {
          show: true,
        },
      },
      xaxis: {
        lines: {
          show: false,
        },
      },
    },
    tooltip: {
      y: {
        formatter: (val) => formatHoursTooltip(val),
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-4 md:p-6 flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500">Your Work Hours</p>
          <p className="text-2xl font-bold text-gray-900">120h 54m</p>
        </div>
        <select className="border-gray-200 rounded-md text-sm text-gray-600 focus:ring-blue-500 focus:border-blue-500">
          <option>View By Month</option>
          <option>View By Week</option>
        </select>
      </div>
      <div className="p-2 md:p-4">
        <Chart options={options} series={series} type="bar" height={250} />
      </div>
    </div>
  );
};

export default WorkHoursChart;