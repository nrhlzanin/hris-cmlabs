'use client';

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { formatJakartaDate } from '@/lib/timezone';
import DashboardLayout from '@/components/layout/NavbarLayout';
import AuthWrapper from '@/components/auth/AuthWrapper';
import { attendanceService, AdminAttendanceRecord, AttendanceFilters } from '@/services/attendance';

import PageHeader from '@/app/admin/components/ui/PageHeader';
import ApprovalModal from "@/app/admin/components/checklock/ApprovalModal";
import DetailsModal from "@/app/admin/components/checklock/DetailsModal";
import AttendanceTable from "@/app/admin/components/checklock/AttendanceTable";
import PaginationControls from "@/app/admin/components/ui/PaginationControls";
import AttendanceControls from "@/app/admin/components/checklock/AttendanceControls";

interface DetailsModalData {
  id: number;
  name: string;
  position: string;
  date: string;
  clockIn: string;
  clockOut: string;
  workHours: string;
  approved: boolean | null;
  fileName?: string;
}

export default function AttendanceOverview() {
  const [attendanceList, setAttendanceList] = useState<AdminAttendanceRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isApprovalOpen, setApprovalOpen] = useState(false);
  const [isDetailsOpen, setDetailsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [perPage, setPerPage] = useState(5);

  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const loadAttendanceData = useCallback(async (page: number = currentPage) => {
    try {
      setLoading(true);
      setError(null);

      const filters: AttendanceFilters = {
        search: debouncedSearchTerm || undefined,
        page,
        per_page: perPage,
        date_from: undefined,
        date_to: undefined,
      };

      const response = await attendanceService.getAdminCheckClockRecords(filters);

      setAttendanceList(response.data);
      setCurrentPage(response.pagination.current_page);
      setTotalPages(response.pagination.last_page);
      setTotalRecords(response.pagination.total);
    } catch (err) {
      console.error('Error loading attendance data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load attendance data');
      setAttendanceList([]);
      setTotalRecords(0);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchTerm, perPage, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
    loadAttendanceData(1);
  }, [debouncedSearchTerm, perPage, loadAttendanceData]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    loadAttendanceData(page);
  }, [loadAttendanceData]);

  const openApprovalModal = useCallback((id: number) => {
    setSelectedId(id);
    setApprovalOpen(true);
  }, []);

  const openDetailsModal = useCallback((id: number) => {
    setSelectedId(id);
    setDetailsOpen(true);
  }, []);

  const closeApprovalModal = useCallback(() => {
    setApprovalOpen(false);
    setSelectedId(null);
  }, []);

  const closeDetailsModal = useCallback(() => {
    setDetailsOpen(false);
    setSelectedId(null);
  }, []);

  const handleApprove = useCallback(async (recordId: number, notes?: string) => {
    try {
      await attendanceService.approveAttendance(recordId, notes);
      await loadAttendanceData(currentPage);
    } catch (error) {
      console.error('Error approving attendance:', error);
      throw error;
    }
  }, [loadAttendanceData, currentPage]);

  const handleReject = useCallback(async (recordId: number, notes: string) => {
    try {
      await attendanceService.declineAttendance(recordId, notes);
      await loadAttendanceData(currentPage);
    } catch (error) {
      console.error('Error declining attendance:', error);
      throw error;
    }
  }, [loadAttendanceData, currentPage]);

  const selectedDataForModals = useMemo(() => {
    const record = attendanceList.find((item) => item.id === selectedId);
    if (!record) return null;

    const fileName = (typeof record.proof_file_url === 'string' && record.proof_file_url)
      ? record.proof_file_url.split('/').pop()
      : 'No file';

    const detailsData: DetailsModalData = {
      id: record.id,
      name: record.name,
      position: record.position,
      clockIn: record.clockIn,
      clockOut: record.clockOut,
      workHours: record.workHours || 'N/A',
      approved: record.approval_status === 'approved' ? true : (record.approval_status === 'declined' ? false : null),
      fileName: fileName,
      date: record.date,
    };
    return detailsData;
  }, [attendanceList, selectedId]);

  return (
    <AuthWrapper requireAdmin={true}>
      <DashboardLayout>
        <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8 w-full">
          <div className="w-full max-w-7xl mx-auto bg-white rounded shadow p-6">
            <PageHeader title="Check Clock" />
            <AttendanceControls
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              perPage={perPage}
              setPerPage={setPerPage}
              loading={loading}
              onRefresh={() => loadAttendanceData(currentPage)}
            />

            {error && (
              <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded w-full">
                <p>Error: {error}</p>
                <button
                  onClick={() => loadAttendanceData(currentPage)}
                  className="mt-2 px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                >
                  Retry
                </button>
              </div>
            )}

            <AttendanceTable
              attendanceList={attendanceList}
              loading={loading}
              searchTerm={searchTerm}
              openApprovalModal={openApprovalModal}
              openDetailsModal={openDetailsModal}
            />

            {!loading && totalRecords > 0 && (
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                totalRecords={totalRecords}
                perPage={perPage}
                onPageChange={handlePageChange}
              />
            )}
          </div>

          {/* Modals tetap di luar kontainer utama karena mereka overlay */}
          {isApprovalOpen && selectedDataForModals && (
            <ApprovalModal
              isOpen={isApprovalOpen}
              selectedData={selectedDataForModals as AdminAttendanceRecord}
              onApprove={handleApprove}
              onDecline={handleReject}
              closeModal={closeApprovalModal}
            />
          )}

          {isDetailsOpen && selectedDataForModals && (
            <DetailsModal
              isOpen={isDetailsOpen}
              selectedData={selectedDataForModals}
              closeModal={closeDetailsModal}
            />
          )}
        </div>
      </DashboardLayout>
    </AuthWrapper>
  );
}