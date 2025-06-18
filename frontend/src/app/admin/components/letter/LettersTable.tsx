'use client';

import React from 'react';
import { EyeIcon } from '@heroicons/react/24/outline';
import { Letter, getStatusColor } from '@/app/admin/letter/page';

interface LettersTableProps {
  letters: Letter[];
  loading: boolean;
  onViewHistory: (letter: Letter) => void;
}

const LettersTable: React.FC<LettersTableProps> = ({ letters, loading, onViewHistory }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full md:min-w-[700px] w-full bg-white">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase sm:px-6 sm:py-3">Employee Name</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase sm:px-6 sm:py-3">Letter Name</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase sm:px-6 sm:py-3">Letter Type</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase sm:px-6 sm:py-3">Valid Until</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase sm:px-6 sm:py-3">Status</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase sm:px-6 sm:py-3">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {loading ? (
            <tr>
              <td className="px-4 py-6 text-center text-gray-500 sm:px-6 sm:py-8" colSpan={6}>
                <div className="flex justify-center items-center">
                  <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-500"></div>
                  <span className="ml-2 text-sm sm:text-base">Loading letters...</span>
                </div>
              </td>
            </tr>
          ) : letters.length > 0 ? (
            letters.map((letter) => (
              <tr key={letter.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap flex items-center gap-2 sm:px-6 sm:py-4">
                  <img className="h-6 w-6 rounded-full sm:h-8 sm:w-8" src={`https://i.pravatar.cc/40?u=${letter.id}`} alt="" />
                  <span className="text-xs font-medium text-gray-900 sm:text-sm">{letter.employee_name}</span>
                </td>
                <td className="px-4 py-3 text-xs text-gray-600 sm:px-6 sm:py-4 sm:text-sm">{letter.letterName}</td>
                <td className="px-4 py-3 text-xs text-gray-600 sm:px-6 sm:py-4 sm:text-sm">{letter.letterType}</td>
                <td className="px-4 py-3 text-xs text-gray-600 sm:px-6 sm:py-4 sm:text-sm">{letter.validUntil}</td>
                <td className="px-4 py-3 sm:px-6 sm:py-4">
                  <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full text-white ${getStatusColor(letter.status)} sm:px-3 sm:py-1`}>
                    {letter.status.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                  </span>
                </td>
                <td className="px-4 py-3 sm:px-6 sm:py-4">
                  <button
                    onClick={() => onViewHistory(letter)}
                    className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-gray-200"
                    title="View History"
                  >
                    <EyeIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="px-4 py-4 text-center text-gray-500 sm:px-6 sm:py-4" colSpan={6}>
                No letters found. Click refresh to load data.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LettersTable;