'use client';

import React, { useState, useEffect } from 'react';
import { apiService } from '@/services/api';

import PaginationControls from '@/app/admin/components/ui/PaginationControls';
import PageHeader from '@/app/admin/components/ui/PageHeader';
import DashboardLayout from '@/components/layout/NavbarLayout';
import AuthWrapper from '@/components/auth/AuthWrapper';
import LettersTable from '@/app/admin/components/letter/LettersTable';
import LetterHistoryModal from '@/app/admin/components/letter/LetterHistoryModal';


export type Letter = {
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

export const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'approved': return 'bg-green-600';
    case 'declined': return 'bg-red-600';
    case 'waiting_reviewed': return 'bg-yellow-600';
    case 'pending': return 'bg-blue-600';
    default: return 'bg-gray-500';
  }
};

const RECORDS_PER_PAGE = 5;

export default function LettersOverview() {
  const [letters, setLetters] = useState<Letter[]>([]);
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const fetchLetters = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getLetters({ search: searchTerm });

      if (response.success) {
        const apiLetters = response.data.letters || [];
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
        setTotalRecords(transformedLetters.length);
      } else {
        setError(response.message || 'Failed to fetch letters');
        setLetters([]);
        setTotalRecords(0);
      }
    } catch (err) {
      console.error('Error fetching letters:', err);
      setError('Failed to connect to server. Please check if the backend is running.');
      setLetters([]);
      setTotalRecords(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLetters();
  }, [searchTerm]);

  const totalPages = Math.ceil(totalRecords / RECORDS_PER_PAGE);

  const startIndex = (currentPage - 1) * RECORDS_PER_PAGE;
  const paginatedLetters = letters.slice(startIndex, startIndex + RECORDS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleViewHistory = async (letter: Letter) => {
    try {
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
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <PageHeader title="Letters Overview">
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search Employee"
                className="border rounded px-2 py-1 w-full sm:w-auto"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                className="bg-green-500 text-white px-4 py-2 rounded text-sm w-full sm:w-auto"
                onClick={fetchLetters}
                disabled={loading}
              >
                🔄 {loading ? 'Loading...' : 'Refresh'}
              </button>
            </div>
          </PageHeader>

          {error && (
            <div className="mb-4 p-3 sm:p-4 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
              <div className="flex justify-between items-center">
                <span>{error}</span>
                <button
                  onClick={() => setError(null)}
                  className="text-red-700 hover:text-red-900 font-bold ml-2"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          <LettersTable
            letters={paginatedLetters}
            loading={loading}
            onViewHistory={handleViewHistory}
          />

          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            totalRecords={totalRecords}
            perPage={RECORDS_PER_PAGE}
            onPageChange={handlePageChange}
          />
        </div>

        {selectedLetter && isHistoryOpen && (
          <LetterHistoryModal
            letter={selectedLetter}
            onClose={() => { setIsHistoryOpen(false); setSelectedLetter(null); }}
            onApprove={(description) => handleUpdateLetter(selectedLetter, 'approve', description)}
            onDecline={(description) => handleUpdateLetter(selectedLetter, 'decline', description)}
            getStatusColor={getStatusColor}
          />
        )}
      </DashboardLayout>
    </AuthWrapper>
  );
}