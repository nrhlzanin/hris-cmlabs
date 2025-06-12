'use client';

import React, { useState, useEffect } from 'react';
import { getCurrentAttendanceTime } from '@/lib/timezone';

interface RealTimeClockProps {
  showSeconds?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function RealTimeClock({ 
  showSeconds = true, 
  className = '',
  size = 'md'
}: RealTimeClockProps) {
  const [timeData, setTimeData] = useState({
    time: '',
    date: '',
    timezone: 'WIB'
  });

  useEffect(() => {
    const updateTime = () => {
      const attendanceTime = getCurrentAttendanceTime();
      setTimeData({
        time: attendanceTime.time,
        date: attendanceTime.date,
        timezone: attendanceTime.timezone
      });
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl'
  };

  return (
    <div className={`font-mono ${className}`}>
      <div className={`font-bold ${sizeClasses[size]}`}>
        {timeData.time} {timeData.timezone}
      </div>
      {size !== 'sm' && (
        <div className="text-sm opacity-90 mt-1">
          {timeData.date}
        </div>
      )}
    </div>
  );
}
