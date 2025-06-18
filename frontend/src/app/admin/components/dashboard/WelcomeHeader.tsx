import React from 'react';

interface WelcomeHeaderProps {
  greeting: string;
  currentTime: string;
  formattedDate: string;
  isWorkingHours: boolean;
  isOvertimeHours: boolean;
  userName: string;
}

const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({
  greeting,
  currentTime,
  formattedDate,
  isWorkingHours,
  isOvertimeHours,
  userName,
}) => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl p-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-xl md:text-2xl font-bold mb-1">{greeting}, {userName}!</h1>
          <p className="text-blue-100">Here&apos;s what&apos;s happening with your team today.</p>
        </div>
        <div className="text-right">
          <p className="text-blue-100 text-sm">Jakarta Time (WIB)</p>
          <p className="text-lg md:text-xl font-semibold">{currentTime}</p>
          <p className="text-indigo-200 text-sm">{formattedDate}</p>
          <div className="mt-2">
            {isWorkingHours && (
              <span className="inline-block bg-green-500 text-white text-xs px-2 py-1 rounded">
                Working Hours
              </span>
            )}
            {isOvertimeHours && (
              <span className="inline-block bg-orange-500 text-white text-xs px-2 py-1 rounded">
                Overtime Hours
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WelcomeHeader;