'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { overtimeService, type OvertimeRecord } from '@/services/overtime';
import { Search, Filter, Plus } from 'lucide-react';

import DashboardLayout from '@/components/layout/NavbarLayout';
import AuthWrapper from '@/components/auth/AuthWrapper';
import { CompletionDialog } from '@/app/user/components/overtime/CompletionDialog';
import { OvertimeList } from '@/app/user/components/overtime/OvertimeList';
import PaginationControls from '@/app/user/components/ui/PaginationControls';
import FilterPanel from '@/app/user/components/overtime/FilterPanel';
import PageHeader from '@/app/user/components/ui/PageHeader';

export default function UserOvertimePage() {
  const [allRecords, setAllRecords] = useState<OvertimeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completionDialogOpen, setCompletionDialogOpen] = useState(false);
  const [selectedOvertime, setSelectedOvertime] = useState<OvertimeRecord | null>(null);
  const { toast } = useToast();

  // State untuk Header dan Paginasi
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const loadOvertimeRecords = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await overtimeService.getOvertimeRecords({ per_page: 500, sort_by: 'overtime_date', sort_order: 'desc' });
      setAllRecords(response.data);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to load overtime records';
      setError(errorMessage);
      toast({ title: 'Error', description: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOvertimeRecords();
  }, []);
  
  // Reset ke halaman 1 jika filter berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itemsPerPage]);

  const handleCompleteOvertime = (overtime: OvertimeRecord) => {
    setSelectedOvertime(overtime);
    setCompletionDialogOpen(true);
  };
  
  // Logika untuk filter dan paginasi di sisi klien
  const filteredRecords = useMemo(() => {
    return allRecords.filter(record => 
      record.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allRecords, searchTerm]);

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <AuthWrapper requireAdmin={false}>
      <DashboardLayout>
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <PageHeader title="Overtime">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search by reason..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-10 pl-10 pr-4 py-2.5 w-full sm:w-80 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="h-10 px-3 py-2.5 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 text-sm text-gray-700"
              >
                <option value={5}>5/page</option>
                <option value={10}>10/page</option>
                <option value={25}>25/page</option>
              </select>
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="h-10 flex items-center gap-2 px-4 py-2.5 bg-gray-50 rounded-md hover:bg-gray-100 border border-gray-200 text-sm font-medium text-gray-700"
              >
                <Filter className="w-4 h-4" />
                <span>Filter</span>
              </button>
            </div>
          </PageHeader>
          
          {isFilterOpen && <FilterPanel />}
          
          <OvertimeList
            loading={loading}
            error={error}
            records={paginatedRecords}
            onCompleteOvertime={handleCompleteOvertime}
            onRetry={loadOvertimeRecords}
          />
          
          {!loading && filteredRecords.length > 0 && (
             <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalRecords={filteredRecords.length}
              perPage={itemsPerPage}
            />
          )}

          <CompletionDialog
            isOpen={completionDialogOpen}
            onOpenChange={setCompletionDialogOpen}
            overtimeRecord={selectedOvertime}
            onSuccess={loadOvertimeRecords}
          />
        </div>
      </DashboardLayout>
    </AuthWrapper>
  );
}