'use client';

import { Clock, MapPin } from 'lucide-react';
import { useJakartaTime, useWorkingHours } from '@/hooks/use-timezone';

interface TimeWidgetProps {
  className?: string;
  showDate?: boolean;
  showTimezone?: boolean;
  showWorkingStatus?: boolean;
}

export default function TimeWidget({ 
  className = '', 
  showDate = true, 
  showTimezone = true,
  showWorkingStatus = true 
}: TimeWidgetProps) {
  const { formattedDate, formattedTime } = useJakartaTime();
  const { isWorkingHours, isOvertimeHours } = useWorkingHours();

  const getWorkingStatus = () => {
    if (isWorkingHours) {
      return { text: 'Working Hours', color: 'bg-green-500' };
    } else if (isOvertimeHours) {
      return { text: 'Overtime Hours', color: 'bg-orange-500' };
    } else {
      return { text: 'Off Hours', color: 'bg-gray-500' };
    }
  };

  const workingStatus = getWorkingStatus();

  return (
    <div className={`bg-white rounded-lg shadow-sm border p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Clock className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold text-gray-900">{formattedTime}</p>
              {showTimezone && (
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  WIB
                </span>
              )}
            </div>
            {showDate && (
              <div className="flex items-center gap-1 mt-1">
                <MapPin className="h-3 w-3 text-gray-400" />
                <p className="text-sm text-gray-600">{formattedDate}</p>
              </div>
            )}
          </div>
        </div>
        
        {showWorkingStatus && (
          <div className="text-right">
            <span className={`inline-block ${workingStatus.color} text-white text-xs px-3 py-1 rounded-full font-medium`}>
              {workingStatus.text}
            </span>
            <p className="text-xs text-gray-500 mt-1">Jakarta Time</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Compact version for headers
export function CompactTimeWidget({ className = '' }: { className?: string }) {
  const { formattedTime } = useJakartaTime();
  const { isWorkingHours, isOvertimeHours } = useWorkingHours();

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Clock className="h-4 w-4 text-gray-600" />
      <span className="font-mono text-sm font-medium">{formattedTime}</span>
      <span className="text-xs text-gray-500">WIB</span>
      {(isWorkingHours || isOvertimeHours) && (
        <div className={`w-2 h-2 rounded-full ${isWorkingHours ? 'bg-green-500' : 'bg-orange-500'}`} />
      )}
    </div>
  );
}
