'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaCheck, FaTimes, FaPlus, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import ApprovalModal from "@/app/components/admin/checklock/approval";
import DetailsModal from "@/app/components/admin/checklock/detailsmodal";
import { formatJakartaDate } from '@/lib/timezone';
import DashboardLayout from '@/components/layout/NavbarLayout';
import AuthWrapper from '@/components/auth/AuthWrapper';
import { attendanceService, AdminAttendanceRecord, AttendanceFilters } from '@/services/attendance';

export default function AttendanceOverview() {
  const [attendanceList, setAttendanceList] = useState<AdminAttendanceRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isApprovalOpen, setApprovalOpen] = useState(false);
  const [isDetailsOpen, setDetailsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [perPage, setPerPage] = useState(15);
  const [hasMorePages, setHasMorePages] = useState(false);

  // Load attendance data
  const loadAttendanceData = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const filters: AttendanceFilters = {
        search: searchTerm || undefined,
        page,
        per_page: perPage,
        // Default to current month for better performance
        date_from: undefined,
        date_to: undefined,
      };

      const response = await attendanceService.getAdminCheckClockRecords(filters);
      
      setAttendanceList(response.data);
      setCurrentPage(response.pagination.current_page);
      setTotalPages(response.pagination.last_page);
      setTotalRecords(response.pagination.total);
      setHasMorePages(response.pagination.has_more_pages);
      
    } catch (err) {
      console.error('Error loading attendance data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load attendance data');
      setAttendanceList([]);
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount and when search/page changes
  useEffect(() => {
    loadAttendanceData(1);
  }, [searchTerm, perPage]);

  // Handle search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (currentPage !== 1) {
        setCurrentPage(1);
      } else {
        loadAttendanceData(1);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    loadAttendanceData(page);
  };
  const openApprovalModal = (id: number) => {
    setSelectedId(id);
    setApprovalOpen(true);
  };

  const openDetailsModal = (id: number) => {
    setSelectedId(id);
    setDetailsOpen(true);
  };

  const closeApprovalModal = () => {
    setApprovalOpen(false);
    setSelectedId(null);
  };

  const closeDetailsModal = () => {
    setDetailsOpen(false);
    setSelectedId(null);
  };
  const handleApprove = async (recordId: number, notes?: string) => {
    try {
      await attendanceService.approveAttendance(recordId, notes);
      // Reload data to reflect changes
      await loadAttendanceData(currentPage);
    } catch (error) {
      console.error('Error approving attendance:', error);
      throw error; // Re-throw to let modal handle the error
    }
  };

  const handleReject = async (recordId: number, notes: string) => {
    try {
      await attendanceService.declineAttendance(recordId, notes);
      // Reload data to reflect changes
      await loadAttendanceData(currentPage);
    } catch (error) {
      console.error('Error declining attendance:', error);
      throw error; // Re-throw to let modal handle the error
    }
  };

  // Filter data based on search term
  const filteredAttendance = attendanceList.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedData = attendanceList.find((item) => item.id === selectedId);

  // Pagination component
  const PaginationControls = () => {
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
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaChevronLeft className="w-3 h-3 mr-1" />
            Previous
          </button>
          
          {pageNumbers.map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
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
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || !hasMorePages}
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <FaChevronRight className="w-3 h-3 ml-1" />
          </button>
        </div>
      </div>
    );
  };  return (
    <AuthWrapper requireAdmin={true}>
      <DashboardLayout>
        <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8 w-full">
          <div className="w-full max-w-7xl mx-auto bg-white rounded shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Attendance Overview</h2>
              <div className="text-sm text-gray-600 text-right">
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
                <p className="text-xs">All times shown in Jakarta timezone</p>
              </div>
            </div>

            {/* Search & Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <input
                type="text"
                placeholder="Search Employee"
                className="w-full sm:w-1/2 border rounded px-3 py-2"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search Employee"
              />
              <div className="flex gap-2">
                <select
                  value={perPage}
                  onChange={(e) => setPerPage(Number(e.target.value))}
                  className="border rounded px-3 py-2 text-sm"
                >
                  <option value={10}>10 per page</option>
                  <option value={15}>15 per page</option>
                  <option value={25}>25 per page</option>
                  <option value={50}>50 per page</option>
                </select>
                <button 
                  onClick={() => loadAttendanceData(currentPage)}
                  className="border px-4 py-2 rounded hover:bg-gray-50"
                  disabled={loading}
                >
                  {loading ? 'Loading...' : 'Refresh'}
                </button>
                <Link href="absensi/" passHref>
                  <button
                    className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    title="Add Data"
                    aria-label="Add Data"
                  >
                    <FaPlus className="w-4 h-4" />
                    <span className="hidden sm:inline">Add Data</span>
                  </button>
                </Link>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                <p>Error: {error}</p>
                <button 
                  onClick={() => loadAttendanceData(currentPage)}
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
                <span className="ml-3 text-gray-600">Loading attendance data...</span>
              </div>
            )}

            {/* Table */}
            {!loading && (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left">
                  <thead className="bg-gray-100 text-gray-700">
                    <tr>
                      <th className="px-4 py-2">Employee Name</th>
                      <th className="px-4 py-2">Jabatan</th>
                      <th className="px-4 py-2">Clock In</th>
                      <th className="px-4 py-2">Clock Out</th>
                      <th className="px-4 py-2">Work Hours</th>
                      <th className="px-4 py-2">Approve</th>
                      <th className="px-4 py-2">Status</th>
                      <th className="px-4 py-2">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredAttendance.length === 0 ? (
                      <tr>
                        <td
                          colSpan={8}
                          className="px-4 py-8 text-center text-gray-500"
                        >
                          {searchTerm ? 'No attendance data found matching your search.' : 'No attendance data found.'}
                        </td>
                      </tr>
                    ) : (
                      filteredAttendance.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-4 py-2">{item.name}</td>
                          <td className="px-4 py-2">{item.position}</td>
                          <td className="px-4 py-2">{item.clockIn}</td>
                          <td className="px-4 py-2">{item.clockOut}</td>
                          <td className="px-4 py-2">{item.workHours}</td>                          <td className="px-4 py-2">
                            <button
                              onClick={() => openApprovalModal(item.id)}
                              className="flex items-center justify-center w-8 h-8 rounded hover:bg-gray-100"
                              aria-label="Manage approval"
                            >
                              {item.approval_status === 'approved' ? (
                                <FaCheck
                                  className="w-5 h-5 text-green-600"
                                  aria-label="Approved"
                                />
                              ) : item.approval_status === 'declined' ? (
                                <FaTimes
                                  className="w-5 h-5 text-red-600"
                                  aria-label="Declined"
                                />
                              ) : (
                                <FaTimes
                                  className="w-5 h-5 text-gray-400"
                                  aria-label="Pending Approval"
                                />
                              )}
                            </button>
                          </td>
                          <td className="px-4 py-2">
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                item.approval_status === 'approved'
                                  ? "bg-green-200 text-green-700"
                                  : item.approval_status === 'declined'
                                    ? "bg-red-200 text-red-700"
                                    : "bg-yellow-200 text-yellow-700"
                              }`}
                            >
                              {item.approval_status === 'approved'
                                ? "Approved"
                                : item.approval_status === 'declined'
                                  ? "Declined"
                                  : "Pending"}
                              {item.is_manual_entry && (
                                <span className="ml-1 text-xs bg-blue-100 text-blue-600 px-1 rounded">
                                  Manual
                                </span>
                              )}
                            </span>
                          </td>
                          <td className="px-4 py-2">
                            <button
                              onClick={() => openDetailsModal(item.id)}
                              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination Controls */}
            {!loading && totalRecords > 0 && <PaginationControls />}
          </div>          {/* Approval Modal */}
          {isApprovalOpen && selectedData && (
            <ApprovalModal
              isOpen={isApprovalOpen}
              selectedData={selectedData}
              onApprove={handleApprove}
              onDecline={handleReject}
              closeModal={closeApprovalModal}
            />
          )}

          {/* Details Modal */}
          {isDetailsOpen && selectedData && (
            <DetailsModal
              isOpen={isDetailsOpen}
              selectedData={selectedData}
              closeModal={closeDetailsModal}
            />
          )}
        </div>
      </DashboardLayout>
    </AuthWrapper>
  );
}
