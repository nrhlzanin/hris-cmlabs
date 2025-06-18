'use client';

import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  perPage: number;
  onPageChange: (page: number) => void;
}

const PaginationControls: React.FC<PaginationProps> = ({ currentPage, totalPages, totalRecords, perPage, onPageChange }) => {
  if (totalPages <= 1) return null;

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    onPageChange(page);
  };

  const pageNumbers = [];
  const maxVisiblePages = 3;
  let startPage = Math.max(1, currentPage - 1);
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
      <div className="text-sm text-gray-700">
        Showing <span className="font-medium">{Math.min(((currentPage - 1) * perPage) + 1, totalRecords)}</span>
        {' '}to <span className="font-medium">{Math.min(currentPage * perPage, totalRecords)}</span>
        {' '}of <span className="font-medium">{totalRecords}</span> results
      </div>
      <nav className="flex items-center gap-2" aria-label="Pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center justify-center px-3 h-8 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaChevronLeft className="w-3 h-3" />
        </button>
        {startPage > 1 && (
          <>
            <button onClick={() => handlePageChange(1)} className="px-3 h-8 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-100">1</button>
            {startPage > 2 && <span className="px-1 h-8 flex items-center text-sm text-gray-500">...</span>}
          </>
        )}
        {pageNumbers.map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-3 h-8 text-sm font-medium rounded-md border ${
              page === currentPage
                ? 'z-10 text-white bg-blue-600 border-blue-600'
                : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-100'
            }`}
          >
            {page}
          </button>
        ))}
        {endPage < totalPages && (
           <>
            {endPage < totalPages - 1 && <span className="px-1 h-8 flex items-center text-sm text-gray-500">...</span>}
            <button onClick={() => handlePageChange(totalPages)} className="px-3 h-8 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-100">{totalPages}</button>
          </>
        )}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center justify-center px-3 h-8 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaChevronRight className="w-3 h-3" />
        </button>
      </nav>
    </div>
  );
};

export default PaginationControls;