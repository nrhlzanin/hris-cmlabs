import React from 'react';

const ProfileCard: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="text-center">
        <div className="w-20 aspect-square bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
          <span className="text-2xl font-bold text-gray-600">JD</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900">John Doe</h3>
        <p className="text-sm text-gray-600">Software Developer</p>
        <p className="text-xs text-gray-500 mt-1">Employee ID: EMP001</p>
      </div>
      <div className="mt-6 pt-6 border-t">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Performance</span>
          <span className="font-medium text-green-600">Excellent</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-2">
          <span className="text-gray-600">Department</span>
          <span className="font-medium">Engineering</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;