'use client';

import React from 'react';

interface FilterPanelProps {
  // Anda bisa menambahkan state dan handler filter di sini
}

const FilterPanel: React.FC<FilterPanelProps> = () => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg mb-6 border grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
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
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
      <div className="flex items-end">
        <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Apply</button>
      </div>
    </div>
  );
};

export default FilterPanel;