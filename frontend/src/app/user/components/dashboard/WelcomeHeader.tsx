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
    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl p-6 mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold mb-1">{greeting}, {userName}!</h1>
          <p className="text-indigo-100">Ready to make today productive?</p>
        </div>
        <div className="w-full sm:w-auto text-left sm:text-right">
          <p className="text-indigo-100 text-sm">Jakarta Time (WIB)</p>
          <p className="text-lg md:text-xl font-semibold">{currentTime}</p>
          <p className="text-indigo-200 text-sm">{formattedDate}</p>
          <div className="mt-2 flex items-center gap-2 sm:justify-end">
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
};

export default WelcomeHeader;