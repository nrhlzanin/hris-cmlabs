'use client';

import React from 'react';
import Link from 'next/link';
import { FaPlus } from 'react-icons/fa';

interface AttendanceControlsProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  perPage: number;
  setPerPage: (perPage: number) => void;
  loading: boolean;
  onRefresh: () => void;
}

const AttendanceControls: React.FC<AttendanceControlsProps> = ({
  searchTerm,
  setSearchTerm,
  perPage,
  setPerPage,
  loading,
  onRefresh,
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <input
        type="text"
        placeholder="Search Employee"
        className="w-full sm:w-1/2 border rounded px-3 py-2"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        aria-label="Search Employee"
      />
      <div className="flex gap-2 w-full sm:w-auto flex-wrap justify-end items-stretch">
        <select
          value={perPage}
          onChange={(e) => setPerPage(Number(e.target.value))}
          className="border rounded px-3 py-2 text-sm flex-grow sm:flex-grow-0 h-auto"
        >
          <option value={5}>5 per page</option>
          <option value={10}>10 per page</option>
          <option value={25}>25 per page</option>
          <option value={50}>50 per page</option>
        </select>
        <button
          onClick={onRefresh}
          className="border rounded px-3 py-2 text-sm flex-grow sm:flex-grow-0 hover:bg-gray-50"
          disabled={loading}
          aria-label="Refresh Attendance Data"
        >
          {loading ? 'Loading...' : 'Refresh'}
        </button>
        <Link href="/admin/absensi/add" passHref>
          <button
            className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex-grow sm:flex-grow-0"
            title="Add Data"
            aria-label="Add New Attendance Data"
          >
            <FaPlus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Data</span>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default AttendanceControls;