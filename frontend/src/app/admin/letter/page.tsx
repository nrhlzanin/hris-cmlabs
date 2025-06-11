'use client';
import React, { useState, useEffect } from 'react';
import { formatJakartaDate } from '@/lib/timezone';
import { EyeIcon } from '@heroicons/react/24/outline';
import { apiService } from '@/services/api';
import DashboardLayout from '@/components/layout/DashboardLayout';
import AuthWrapper from '@/components/auth/AuthWrapper';

// Define the letter type
type Letter = {
  id: number;
  name: string;
  letterName: string;
  letterType: string;
  validUntil: string;
  status: string;
  employee_name: string;
  history: Array<{
    date: string;
    status: string;
    description: string;
    actor?: string;
  }>;
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'approved': return 'bg-green-600';
    case 'declined': return 'bg-red-600';
    case 'waiting_reviewed': return 'bg-yellow-600';
    case 'pending': return 'bg-blue-600';
    default: return 'bg-gray-500';
  }
};

export default function LettersOverview() {
  const [letters, setLetters] = useState<Letter[]>([]);
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch letters from API
  const fetchLetters = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getLetters({ search: searchTerm });
      
      if (response.success) {
        const apiLetters = response.data.letters || [];
        // Transform API data to match our component's Letter type
        const transformedLetters: Letter[] = apiLetters.map((letter: any) => ({
          id: letter.id,
          name: letter.employee_name || letter.name,
          letterName: letter.name || letter.letterName,
          letterType: letter.letter_type || letter.letterType,
          validUntil: letter.validUntil || letter.formatted_valid_until || 'N/A',
          status: letter.status,
          employee_name: letter.employee_name || letter.name,
          history: letter.history || []
        }));
        setLetters(transformedLetters);
      } else {
        setError(response.message || 'Failed to fetch letters');
      }
    } catch (err) {
      console.error('Error fetching letters:', err);
      setError('Failed to connect to server. Please check if the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  // Load letters on component mount
  useEffect(() => {
    fetchLetters();
  }, []);

  const filteredLetters = letters.filter((letter) =>
    letter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    letter.employee_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewHistory = async (letter: Letter) => {
    try {
      // Fetch fresh history data from API
      const response = await apiService.getLetterHistory(letter.id);
      if (response.success) {
        const updatedLetter = { 
          ...letter, 
          history: response.data.history || [] 
        };
        setSelectedLetter(updatedLetter);
        setIsHistoryOpen(true);
      } else {
        setSelectedLetter(letter);
        setIsHistoryOpen(true);
      }
    } catch (error) {
      console.error('Error fetching letter history:', error);
      setSelectedLetter(letter);
      setIsHistoryOpen(true);
    }
  };

  const handleUpdateLetter = async (updated: Letter, action: 'approve' | 'decline', description?: string) => {
    try {
      let response;
      if (action === 'approve') {
        response = await apiService.approveLetter(updated.id, description);
      } else {
        response = await apiService.declineLetter(updated.id, description || 'Letter declined');
      }

      if (response.success) {
        // Refresh the letters list
        await fetchLetters();
        setIsHistoryOpen(false);
        setSelectedLetter(null);
      } else {
        setError(response.message || `Failed to ${action} letter`);
      }
    } catch (err) {
      console.error(`Error ${action}ing letter:`, err);
      setError(`Failed to ${action} letter`);
    }
  };

  return (
    <AuthWrapper requireAdmin={true}>
      <DashboardLayout>
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* HEADER */}
          <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
            <h1 className="text-xl font-bold">Letters Overview</h1>
            <div className="text-sm text-gray-600">
              All dates shown in Jakarta timezone (WIB)
            </div>
            <div className="flex gap-2 flex-wrap">
              <input
                type="text"
                placeholder="Search Employee"
                className="border rounded px-2 py-1"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button 
                className="bg-green-500 text-white px-4 py-2 rounded text-sm" 
                onClick={fetchLetters}
                disabled={loading}
              >
                🔄 {loading ? 'Loading...' : 'Refresh'}
              </button>
            </div>
          </div>

          {/* ERROR MESSAGE */}
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              <div className="flex justify-between items-center">
                <span>{error}</span>
                <button 
                  onClick={() => setError(null)}
                  className="text-red-700 hover:text-red-900 font-bold"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="min-w-[600px] w-full bg-white">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Employee Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Letter Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Letter Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Valid Until</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td className="px-6 py-8 text-center text-gray-500" colSpan={6}>
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        <span className="ml-2">Loading letters...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredLetters.length > 0 ? (
                  filteredLetters.map((letter) => (
                    <tr key={letter.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap flex items-center gap-3">
                        <img className="h-8 w-8 rounded-full" src={`https://i.pravatar.cc/40?u=${letter.id}`} alt="" />
                        <span className="text-sm font-medium text-gray-900">{letter.employee_name}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{letter.letterName}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{letter.letterType}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{letter.validUntil}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full text-white ${getStatusColor(letter.status)}`}>
                          {letter.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleViewHistory(letter)}
                          className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-gray-200"
                          title="View History"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-4 py-4 text-center text-gray-500" colSpan={6}>
                      {searchTerm ? 'No matching letters found.' : 'No letters found. Click refresh to load data.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* LETTER HISTORY MODAL */}
          {selectedLetter && isHistoryOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Letter History - {selectedLetter.name}</h2>
                  <button onClick={() => { setIsHistoryOpen(false); setSelectedLetter(null); }} className="text-gray-500 hover:text-gray-700">✕</button>
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div><span className="font-medium">Letter Name:</span> {selectedLetter.letterName}</div>
                    <div><span className="font-medium">Type:</span> {selectedLetter.letterType}</div>
                    <div><span className="font-medium">Valid Until:</span> {selectedLetter.validUntil}</div>
                    <div>
                      <span className="font-medium">Current Status:</span>
                      <span className={`ml-2 px-2 py-1 text-xs rounded-full text-white ${getStatusColor(selectedLetter.status)}`}>
                        {selectedLetter.status}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">History Timeline:</h3>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {selectedLetter.history.length > 0 ? (
                        selectedLetter.history.map((entry, index) => (
                          <div key={index} className="border-l-4 border-blue-200 pl-4 py-2">
                            <div className="font-medium text-sm">{entry.status}</div>
                            <div className="text-xs text-gray-600">{entry.date}</div>
                            {entry.description && <div className="text-sm text-gray-800 mt-1">{entry.description}</div>}
                            {entry.actor && <div className="text-xs text-gray-500">by {entry.actor}</div>}
                          </div>
                        ))
                      ) : (
                        <div className="text-gray-500 text-sm">No history available</div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end mt-4 gap-2">
                  <button onClick={() => { setIsHistoryOpen(false); setSelectedLetter(null); }} className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600">Close</button>
                  <button onClick={() => handleUpdateLetter(selectedLetter, 'approve', 'Letter approved by admin')} className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">Approve</button>
                  <button onClick={() => handleUpdateLetter(selectedLetter, 'decline', 'Letter declined by admin')} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">Decline</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </AuthWrapper>
  );
}
