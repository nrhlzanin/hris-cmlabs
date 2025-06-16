'use client';

import React from 'react';

const FilterPanel: React.FC = () => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg mb-6 border grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Date From</label>
        <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Date To</label>
        <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
        <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500">
          <option value="">All</option>
          <option value="Approved">Approved</option>
          <option value="Pending">Pending</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>
      <div className="flex items-end space-x-2">
        <button className="w-full px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600">Clear</button>
        <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Apply</button>
      </div>
    </div>
  );
};

export default FilterPanel;