'use client';

import React, { useState, useEffect } from 'react';
import { formatJakartaDateTime, getJakartaTime } from '@/lib/timezone';
import { Search, Plus, Filter } from 'lucide-react';
import DashboardLayout from '@/components/layout/NavbarLayout';
import AuthWrapper from '@/components/auth/AuthWrapper';
import AddLetterModal, { LetterFormData } from '@/app/user/components/letter/AddLetterModal';
import LettersTable from '@/app/user/components/letter/LettersTable';
import PaginationControls from '@/app/user/components/ui/PaginationControls';
import FilterPanel from '@/app/user/components/letter/FilterPanel';
import PageHeader from '@/app/user/components/ui/PageHeader';

interface Letter {
  id: number;
  letterName: string;
  letterType: string;
  letterDescription: string;
  status: string;
  validUntil: string;
  fileName?: string;
  created_at: string;
}

export default function UserLetterPage() {
  const [allLetters, setAllLetters] = useState<Letter[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    fetchLetters();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itemsPerPage]);

  const fetchLetters = async () => {
    setLoading(true);
    const mockLetters: Letter[] = Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      letterName: i % 2 === 0 ? 'Surat Izin Sakit' : 'Pengajuan Cuti Tahunan',
      letterType: i % 2 === 0 ? 'Absence' : 'Annual Leave',
      letterDescription: `Ini adalah deskripsi untuk surat ke-${i + 1}.`,
      status: i % 3 === 0 ? 'Approved' : i % 3 === 1 ? 'Pending' : 'Rejected',
      validUntil: `2025-09-${(i % 30) + 1}`,
      created_at: `2025-08-${(i % 30) + 1}T10:00:00Z`
    }));

    setTimeout(() => {
      setAllLetters(mockLetters);
      setLoading(false);
    }, 1000);
  };

  const handleSubmitLetter = async (formData: LetterFormData) => {
    try {
      const newLetter: Letter = {
        id: allLetters.length + 1,
        letterName: formData.letterName,
        letterType: formData.letterType,
        letterDescription: formData.letterDescription,
        status: 'Pending',
        validUntil: formData.validUntil,
        fileName: formData.file?.name,
        created_at: new Date().toISOString()
      };
      setAllLetters(prev => [newLetter, ...prev]);
      setIsAddModalOpen(false);
      alert('Letter submitted successfully!');
    } catch (error) {
      alert('Error submitting letter.');
    }
  };

  const filteredLetters = allLetters.filter(letter =>
    letter.letterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    letter.letterType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredLetters.length / itemsPerPage);
  const currentLettersOnPage = filteredLetters.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <AuthWrapper requireAdmin={false}>
      <DashboardLayout>
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <PageHeader title="My Letters">
            <div className="flex items-center gap-2">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search letter..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2.5 w-full sm:w-80 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              {/* Select Dropdown (Per Page) */}
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="px-3 py-2.5 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 text-sm text-gray-700"
              >
                <option value={5}>5/page</option>
                <option value={10}>10/page</option>
                <option value={25}>25/page</option>
              </select>

              {/* Tombol Filter */}
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 rounded-md hover:bg-gray-100 border border-gray-200 text-sm font-medium text-gray-700"
              >
                <Filter className="w-4 h-4" />
                <span>Filter</span>
              </button>

              {/* Tombol Add */}
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-md hover:bg-blue-700 font-semibold text-sm"
              >
                <Plus className="h-4 w-4" />
                <span>Add Letter</span>
              </button>
            </div>
          </PageHeader>

          {isFilterOpen && <FilterPanel />}

          <LettersTable letters={currentLettersOnPage} loading={loading} />

          {!loading && filteredLetters.length > 0 && (
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              totalRecords={filteredLetters.length}
              perPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
        <AddLetterModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleSubmitLetter}
        />
      </DashboardLayout>
    </AuthWrapper>
  );
}