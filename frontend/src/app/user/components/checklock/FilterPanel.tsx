'use client';

import React from 'react';

interface FilterPanelProps {
  filters: {
    dateFrom: string;
    dateTo: string;
    status: string;
  };
  onFilterChange: (key: string, value: string) => void;
  onReset: () => void;
  onApply: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onFilterChange, onReset, onApply }) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg mb-6 border grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Date From</label>
        <input
          type="date"
          value={filters.dateFrom}
          onChange={(e) => onFilterChange('dateFrom', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Date To</label>
        <input
          type="date"
          value={filters.dateTo}
          onChange={(e) => onFilterChange('dateTo', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
        <select
          value={filters.status}
          onChange={(e) => onFilterChange('status', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Status</option>
          <option value="On Time">On Time</option>
          <option value="Late">Late</option>
          <option value="Absent">Absent</option>
          <option value="Incomplete">Incomplete</option>
        </select>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={onReset}
          className="w-full px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
        >
          Clear
        </button>
        <button
          onClick={onApply}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default FilterPanel;