/**
 * Timezone utility functions for Indonesian time (GMT+7)
 */

export const JAKARTA_TIMEZONE = 'Asia/Jakarta';

/**
 * Get current Jakarta time
 */
export function getJakartaTime(): Date {
  return new Date(new Date().toLocaleString('en-US', { timeZone: JAKARTA_TIMEZONE }));
}

/**
 * Format date to Jakarta timezone
 */
export function formatJakartaDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleDateString('id-ID', {
    timeZone: JAKARTA_TIMEZONE,
    ...options
  });
}

/**
 * Format time to Jakarta timezone
 */
export function formatJakartaTime(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleTimeString('id-ID', {
    timeZone: JAKARTA_TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    ...options
  });
}

/**
 * Format full datetime to Jakarta timezone
 */
export function formatJakartaDateTime(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleString('id-ID', {
    timeZone: JAKARTA_TIMEZONE,
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    ...options
  });
}

/**
 * Get current date in YYYY-MM-DD format (Jakarta timezone)
 */
export function getJakartaDateString(): string {
  const now = getJakartaTime();
  return now.toISOString().split('T')[0];
}

/**
 * Get current time in HH:MM format (Jakarta timezone)
 */
export function getJakartaTimeString(): string {
  const now = getJakartaTime();
  return now.toTimeString().slice(0, 5);
}

/**
 * Convert UTC datetime to Jakarta timezone
 */
export function utcToJakarta(utcDate: Date | string): Date {
  const dateObj = typeof utcDate === 'string' ? new Date(utcDate) : utcDate;
  return new Date(dateObj.toLocaleString('en-US', { timeZone: JAKARTA_TIMEZONE }));
}

/**
 * Convert Jakarta datetime to UTC
 */
export function jakartaToUtc(jakartaDate: Date): Date {
  // Get the offset difference between Jakarta and UTC
  const utcTime = jakartaDate.getTime() + (jakartaDate.getTimezoneOffset() * 60000);
  const jakartaOffset = 7 * 60; // GMT+7 in minutes
  return new Date(utcTime - (jakartaOffset * 60000));
}

/**
 * Check if date is today in Jakarta timezone
 */
export function isToday(date: Date | string): boolean {
  const today = getJakartaDateString();
  const checkDate = typeof date === 'string' ? date : formatJakartaDate(date, { year: 'numeric', month: '2-digit', day: '2-digit' });
  return today === checkDate;
}

/**
 * Get relative time string (e.g., "2 hours ago", "in 1 day")
 */
export function getRelativeTime(date: Date | string): string {
  const now = getJakartaTime();
  const target = typeof date === 'string' ? new Date(date) : date;
  
  const diffMs = target.getTime() - now.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (Math.abs(diffDays) >= 1) {
    return diffDays > 0 ? `dalam ${diffDays} hari` : `${Math.abs(diffDays)} hari yang lalu`;
  } else if (Math.abs(diffHours) >= 1) {
    return diffHours > 0 ? `dalam ${diffHours} jam` : `${Math.abs(diffHours)} jam yang lalu`;
  } else {
    const diffMinutes = Math.floor(Math.abs(diffMs) / (1000 * 60));
    return diffMs > 0 ? `dalam ${diffMinutes} menit` : `${diffMinutes} menit yang lalu`;
  }
}

/**
 * Working hours helper
 */
export const WORKING_HOURS = {
  START: '08:00',
  END: '17:00',
  OVERTIME_START: '18:00'
} as const;

/**
 * Check if current time is within working hours
 */
export function isWorkingHours(): boolean {
  const now = getJakartaTimeString();
  return now >= WORKING_HOURS.START && now <= WORKING_HOURS.END;
}

/**
 * Check if current time is overtime period
 */
export function isOvertimeHours(): boolean {
  const now = getJakartaTimeString();
  return now >= WORKING_HOURS.OVERTIME_START;
}

/**
 * Get current Jakarta time with automatic formatting for attendance
 */
export function getCurrentAttendanceTime(): {
  time: string;
  date: string;
  datetime: string;
  timezone: string;
} {
  const now = new Date();
  const jakartaTime = new Date(now.toLocaleString('en-US', { timeZone: JAKARTA_TIMEZONE }));
  
  return {
    time: jakartaTime.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }),
    date: jakartaTime.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    datetime: jakartaTime.toLocaleString('id-ID', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }),
    timezone: 'WIB'
  };
}

/**
 * Format attendance record time with timezone
 */
export function formatAttendanceTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const jakartaTime = dateObj.toLocaleTimeString('id-ID', {
    timeZone: JAKARTA_TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
  
  return `${jakartaTime} WIB`;
}

/**
 * Get time difference from now for attendance tracking
 */
export function getTimeDifferenceFromNow(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  
  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
  
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hours ago`;
  
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} days ago`;
}
