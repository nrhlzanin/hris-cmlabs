import { useState, useEffect } from 'react';
import { getJakartaTime, formatJakartaDateTime, formatJakartaDate, formatJakartaTime } from '@/lib/timezone';

interface TimezoneInfo {
  timezone: string;
  offset: string;
  current_time: string;
  current_date: string;
  current_time_string: string;
  is_working_hours: boolean;
  is_overtime_hours: boolean;
  working_hours: {
    start: string;
    end: string;
    overtime_start: string;
  };
}

export function useJakartaTime() {
  const [time, setTime] = useState<Date>(getJakartaTime());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getJakartaTime());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return {
    time,
    formattedDate: formatJakartaDate(time),
    formattedTime: formatJakartaTime(time),
    formattedDateTime: formatJakartaDateTime(time),
  };
}

export function useTimezone() {
  const [timezoneInfo, setTimezoneInfo] = useState<TimezoneInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTimezoneInfo = async () => {
      try {
        const response = await fetch('/api/overtime/timezone-info', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch timezone info');
        }

        const data = await response.json();
        setTimezoneInfo(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        // Fallback to local timezone info
        setTimezoneInfo({
          timezone: 'Asia/Jakarta',
          offset: '+07:00',
          current_time: new Date().toISOString(),
          current_date: new Date().toISOString().split('T')[0],
          current_time_string: new Date().toTimeString().slice(0, 8),
          is_working_hours: false,
          is_overtime_hours: false,
          working_hours: {
            start: '08:00',
            end: '17:00',
            overtime_start: '18:00'
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTimezoneInfo();
  }, []);

  return { timezoneInfo, loading, error };
}

export function useWorkingHours() {
  const { timezoneInfo } = useTimezone();
  const jakartaTime = useJakartaTime();

  const isWorkingHours = () => {
    if (!timezoneInfo) return false;
    const currentTime = jakartaTime.formattedTime;
    return currentTime >= timezoneInfo.working_hours.start && 
           currentTime <= timezoneInfo.working_hours.end;
  };

  const isOvertimeHours = () => {
    if (!timezoneInfo) return false;
    const currentTime = jakartaTime.formattedTime;
    return currentTime >= timezoneInfo.working_hours.overtime_start;
  };

  return {
    isWorkingHours: isWorkingHours(),
    isOvertimeHours: isOvertimeHours(),
    workingHours: timezoneInfo?.working_hours,
    currentTime: jakartaTime.formattedTime,
  };
}
