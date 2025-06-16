'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { FaPlus, FaFilter } from 'react-icons/fa';
import { Filter, Plus, Search } from 'lucide-react';
import { attendanceService, AttendanceRecord, AttendanceFilters } from '@/services/attendance';
import DashboardLayout from '@/components/layout/NavbarLayout';
import AuthWrapper from '@/components/auth/AuthWrapper';
import AttendanceTable from '@/app/user/components/checklock/AttendanceTable';
import PaginationControls from '@/app/user/components/ui/PaginationControls';
import OvertimeRequestModal from '@/app/user/components/checklock/OvertimeRequestModal';
import PageHeader from '@/app/user/components/ui/PageHeader';
import FilterPanel from '@/app/user/components/checklock/FilterPanel';

export default function UserChecklockPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecordId, setSelectedRecordId] = useState<number | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [filters, setFilters] = useState({ dateFrom: '', dateTo: '', status: '' });

  const loadUserAttendanceData = useCallback(async (page: number) => {
    setLoading(true);
    setError(null);
    try {
      const apiFilters: AttendanceFilters = {
        search: searchTerm || undefined,
        page,
        per_page: perPage,
        date_from: filters.dateFrom || undefined,
        date_to: filters.dateTo || undefined,
        status: filters.status || undefined,
      };
      const response = await attendanceService.getAttendanceRecords(apiFilters);
      setAttendanceData(response.data);
      setCurrentPage(response.pagination.current_page);
      setTotalPages(response.pagination.last_page);
      setTotalRecords(response.pagination.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load attendance data');
      setAttendanceData([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, perPage, filters]);

  useEffect(() => {
    setCurrentPage(1);
  }, [perPage, filters, searchTerm]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadUserAttendanceData(currentPage);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [currentPage, loadUserAttendanceData]);

  const openOvertimeModal = (recordId: number) => {
    setSelectedRecordId(recordId);
    setIsModalOpen(true);
  };

  const updateFilter = (key: string, value: string) => setFilters(prev => ({ ...prev, [key]: value }));
  const resetFilters = () => setFilters({ dateFrom: '', dateTo: '', status: '' });
  const executeFilters = () => { loadUserAttendanceData(1); setIsFilterOpen(false); };

  return (
    <AuthWrapper requireAdmin={false}>
      <DashboardLayout>
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <PageHeader title="Check In/Out Overview">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-52 pl-10 pr-4 py-2 border rounded-md focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <select
                value={perPage}
                onChange={(e) => setPerPage(Number(e.target.value))}
                className="h-full px-3 py-2 border rounded-md focus:ring-1 focus:ring-blue-500 text-sm"
              >
                <option value={10}>10/page</option>
                <option value={25}>25/page</option>
              </select>
              <button onClick={() => setIsFilterOpen(!isFilterOpen)} className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 border text-sm">
                <FaFilter className="w-3 h-3" /> Filter
              </button>
              <Link href="/user/absensi" className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-semibold">
                <FaPlus className="w-3 h-3" /> Add Data
              </Link>
            </div>
          </PageHeader>

          {isFilterOpen && (
            <FilterPanel 
              filters={filters}
              onFilterChange={updateFilter}
              onReset={resetFilters}
              onApply={executeFilters}
            />
          )}

          <AttendanceTable
            attendanceData={attendanceData}
            loading={loading}
            error={error}
            searchTerm={searchTerm}
            onOpenOvertimeModal={openOvertimeModal}
          />
          
          {!loading && totalRecords > 0 && (
            <PaginationControls 
              currentPage={currentPage} 
              totalPages={totalPages} 
              totalRecords={totalRecords} 
              perPage={perPage} 
              onPageChange={(page) => loadUserAttendanceData(page)} 
            />
          )}
        </div>
        
        <OvertimeRequestModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          recordId={selectedRecordId} 
        />
      </DashboardLayout>
    </AuthWrapper>
  );
}