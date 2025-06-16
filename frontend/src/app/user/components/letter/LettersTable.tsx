import React from 'react';
import { formatJakartaDate } from '@/lib/timezone';

interface Letter {
  id: number;
  letterName: string;
  letterType: string;
  letterDescription: string;
  status: string;
  created_at: string;
}

interface LettersTableProps {
  letters: Letter[];
  loading: boolean;
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'approved': return 'text-green-700 bg-green-100';
    case 'rejected': return 'text-red-700 bg-red-100';
    case 'pending': return 'text-yellow-700 bg-yellow-100';
    default: return 'text-gray-700 bg-gray-100';
  }
};

const LettersTable: React.FC<LettersTableProps> = ({ letters, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Letter Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {letters.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-16 text-center text-gray-500">No letters found.</td>
            </tr>
          ) : (
            letters.map((letter) => (
              <tr key={letter.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{formatJakartaDate(new Date(letter.created_at))}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{letter.letterName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{letter.letterType}</td>
                <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate" title={letter.letterDescription}>{letter.letterDescription}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusColor(letter.status)}`}>{letter.status}</span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LettersTable;