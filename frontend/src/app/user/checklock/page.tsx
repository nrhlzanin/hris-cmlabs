'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { attendanceService, AttendanceRecord, AttendanceFilters } from '@/services/attendance';
import { formatJakartaDate } from '@/lib/timezone';
import DashboardLayout from '@/components/layout/DashboardLayout';
import AuthWrapper from '@/components/auth/AuthWrapper';
import OvertimeRequestModal from '@/app/components/User/checklock/OvertimeRequestModal';

export default function UserChecklockPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [hasMorePages, setHasMorePages] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    status: ''
  });

  // Load attendance data for current user only
  const loadUserAttendanceData = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const apiFilters: AttendanceFilters = {
        search: searchTerm || undefined,
        page,
        per_page: perPage,
        date_from: filters.dateFrom || undefined,
        date_to: filters.dateTo || undefined,
        status: filters.status || undefined,
      };

      // Call API untuk user biasa (hanya data mereka sendiri)
      const response = await attendanceService.getAttendanceRecords(apiFilters);
      
      setAttendanceData(response.data);
      setCurrentPage(response.pagination.current_page);
      setTotalPages(response.pagination.last_page);
      setTotalRecords(response.pagination.total);
      setHasMorePages(response.pagination.has_more_pages || false);
      
    } catch (err) {
      console.error('Error loading user attendance data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load attendance data');
      setAttendanceData([]);
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadUserAttendanceData(1);
  }, [perPage]);

  // Handle search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (currentPage !== 1) {
        setCurrentPage(1);
      } else {
        loadUserAttendanceData(1);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Handle page change
  const goToPage = (page: number) => {
    setCurrentPage(page);
    loadUserAttendanceData(page);
  };

  const openOvertimeModal = () => {
    setIsModalOpen(true);
  };

  const closeOvertimeModal = () => {
    setIsModalOpen(false);
  };

  const updateFilter = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      dateFrom: '',
      dateTo: '',
      status: ''
    });
    setSearchTerm('');
  };

  const executeFilters = () => {
    setCurrentPage(1);
    loadUserAttendanceData(1);
    setIsFilterOpen(false);
  };

  // Pagination component
  const UserPaginationControls = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-gray-700">
          Showing {((currentPage - 1) * perPage) + 1} to {Math.min(currentPage * perPage, totalRecords)} of {totalRecords} results
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaChevronLeft className="w-3 h-3 mr-1" />
            Previous
          </button>
          
          {pageNumbers.map((page) => (
            <button
              key={page}
              onClick={() => goToPage(page)}
              className={`px-3 py-2 text-sm font-medium rounded-lg ${
                page === currentPage
                  ? 'text-white bg-blue-600 border border-blue-600'
                  : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700'
              }`}
            >
              {page}
            </button>
          ))}
          
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages || !hasMorePages}
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <FaChevronRight className="w-3 h-3 ml-1" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <AuthWrapper requireAdmin={false}>
      <DashboardLayout>
        <div className="min-h-screen bg-gray-100 p-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">My Attendance Records</h2>
              <div className="text-sm text-gray-600">
                <p>
                  Today:{" "}
                  {formatJakartaDate(new Date(), {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}{" "}
                  WIB
                </p>
                <p className="text-xs">Showing only your attendance records</p>
              </div>
            </div>

            {/* Search & Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <input
                type="text"
                placeholder="Search by date..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-1/2 border rounded px-3 py-2"
              />
              <div className="flex gap-2">
                <select
                  value={perPage}
                  onChange={(e) => setPerPage(Number(e.target.value))}
                  className="border rounded px-3 py-2 text-sm"
                >
                  <option value={5}>5 per page</option>
                  <option value={10}>10 per page</option>
                  <option value={15}>15 per page</option>
                  <option value={25}>25 per page</option>
                </select>
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Filter
                </button>
                <button 
                  onClick={() => loadUserAttendanceData(currentPage)}
                  className="border px-4 py-2 rounded hover:bg-gray-50"
                  disabled={loading}
                >
                  {loading ? 'Loading...' : 'Refresh'}
                </button>
              </div>
            </div>

            {/* Filter Panel */}
            {isFilterOpen && (
              <div className="bg-gray-50 p-4 rounded-lg mb-4 border">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date From</label>
                    <input
                      type="date"
                      value={filters.dateFrom}
                      onChange={(e) => updateFilter('dateFrom', e.target.value)}
                      className="w-full px-3 py-2 border rounded-md focus:ring focus:border-blue-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date To</label>
                    <input
                      type="date"
                      value={filters.dateTo}
                      onChange={(e) => updateFilter('dateTo', e.target.value)}
                      className="w-full px-3 py-2 border rounded-md focus:ring focus:border-blue-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={filters.status}
                      onChange={(e) => updateFilter('status', e.target.value)}
                      className="w-full px-3 py-2 border rounded-md focus:ring focus:border-blue-300"
                    >
                      <option value="">All Status</option>
                      <option value="On Time">On Time</option>
                      <option value="Late">Late</option>
                      <option value="Absent">Absent</option>
                      <option value="Incomplete">Incomplete</option>
                    </select>
                  </div>
                  <div className="flex items-end space-x-2">
                    <button
                      onClick={resetFilters}
                      className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                      Clear
                    </button>
                    <button
                      onClick={executeFilters}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                <p>Error: {error}</p>
                <button 
                  onClick={() => loadUserAttendanceData(currentPage)}
                  className="mt-2 px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Loading Spinner */}
            {loading && (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                <span className="ml-3 text-gray-600">Loading your attendance records...</span>
              </div>
            )}

            {/* Table */}
            {!loading && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-2">Date</th>
                      <th className="px-4 py-2">Clock In</th>
                      <th className="px-4 py-2">Clock Out</th>
                      <th className="px-4 py-2">Work Hours</th>
                      <th className="px-4 py-2 text-center">Status</th>
                      <th className="px-4 py-2 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {attendanceData.length > 0 ? (
                      attendanceData.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-4 py-2">{item.date}</td>
                          <td className="px-4 py-2">{item.clockIn}</td>
                          <td className="px-4 py-2">{item.clockOut}</td>
                          <td className="px-4 py-2">{item.workHours}</td>
                          <td className="px-4 py-2 text-center">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              item.statusColor === 'green' 
                                ? 'bg-green-100 text-green-800' 
                                : item.statusColor === 'red'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-center">
                            <button
                              onClick={openOvertimeModal}
                              className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
                              title="Request Overtime"
                            >
                              Request OT
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                          {searchTerm ? 'No attendance records found matching your search.' : 'No attendance records found.'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination Controls */}
            {!loading && totalRecords > 0 && <UserPaginationControls />}
          </div>

          <OvertimeRequestModal isOpen={isModalOpen} onClose={closeOvertimeModal} />
        </div>
      </DashboardLayout>
    </AuthWrapper>
  );
}