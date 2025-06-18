﻿'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/NavbarLayout';
import AuthWrapper from '@/components/auth/AuthWrapper';
import { employeeService, Employee as EmployeeType, EmployeeFilters } from '@/services/employee';

interface Employee {
  nik: string;
  avatar: string | null;
  first_name: string;
  last_name: string;
  mobile_phone: string;
  gender: string;
  branch: string;
  position: string;
  grade: string;
  contract_type: string;
  last_education: string;
  place_of_birth: string;
  date_of_birth: string;
  bank: string;
  account_number: string;
  acc_holder_name: string;
  letter_id: number | null;
  created_at: string;
  updated_at: string;
  full_name: string;
  avatar_url: string | null;
  age: number;
  letter_format?: {
    id_letter: number;
    name: string;
  };
}

interface ApiResponse {
  success: boolean;
  data: {
    data: Employee[];
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    from: number;
    to: number;
  };
  stats: {
    total_employees: number;
    active_employees: number;
    inactive_employees: number;
    men_count: number;
    women_count: number;
    permanent_count: number;
    contract_count: number;
  };
}

interface FilterOptions {
  genders: string[];
  branches: string[];
  positions: string[];
  contractTypes: string[];
  educations: string[];
  banks: string[];
  grades: string[];
}

export default function EmployeeTable() {
  const [employees, setEmployees] = useState<EmployeeType[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]); // NIKs untuk bulk operations
  const [filters, setFilters] = useState<EmployeeFilters>({
    gender: '',
    branch: '',
    position: '',
    contract_type: '',
    last_education: '',
    bank: '',
    grade: '',
    age_min: '',
    age_max: ''
  });
  const [stats, setStats] = useState({
    total_employees: 0,
    active_employees: 0,
    inactive_employees: 0,
    men_count: 0,
    women_count: 0,
    permanent_count: 0,
    contract_count: 0
  });

  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    genders: ['Men', 'Woman'],
    branches: [],
    positions: [],
    contractTypes: ['Permanent', 'Contract'],
    educations: ['SMA/SMK Sederajat', 'S1', 'S2'],
    banks: ['BCA', 'BNI', 'BRI', 'BSI', 'BTN', 'CMIB', 'Mandiri', 'Permata'],
    grades: []
  });

  const [showImportModal, setShowImportModal] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importLoading, setImportLoading] = useState(false);  const [importResult, setImportResult] = useState<{
    success: boolean;
    message: string;
    imported_count?: number;
    errors?: string[];
    data?: {
      imported: number;
      failed: number;
      total_rows: number;
    };
    total_errors?: number;
    duplicates?: string[];
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Fetch filter options from existing employees
  const fetchFilterOptions = async () => {
    try {
      const options = await employeeService.getFilterOptions();
      setFilterOptions(options);
    } catch (error) {
      console.error('Error fetching filter options:', error);
      // Set default options if error
      setFilterOptions({
        genders: ['Men', 'Woman'],
        branches: [],
        positions: [],
        contractTypes: ['Permanent', 'Contract'],
        educations: ['SMA/SMK Sederajat', 'S1', 'S2'],
        banks: ['BCA', 'BNI', 'BRI', 'BSI', 'BTN', 'CMIB', 'Mandiri', 'Permata'],
        grades: [],
      });
    }
  };if (response.ok) {
        const result: ApiResponse = await response.json();
        const allEmployees = result?.data?.data;
        
        // Check if allEmployees is a valid array before processing
        if (Array.isArray(allEmployees) && allEmployees.length > 0) {
          // Extract unique values for filter options
          const branches = [...new Set(allEmployees.map(emp => emp.branch))].filter(Boolean);
          const positions = [...new Set(allEmployees.map(emp => emp.position))].filter(Boolean);
          const grades = [...new Set(allEmployees.map(emp => emp.grade))].filter(Boolean);

          setFilterOptions(prev => ({
            ...prev,
            branches: branches.sort(),
            positions: positions.sort(),
            grades: grades.sort()
          }));
        } else {
          console.warn('No employee data found for filter options');
        }
      }    } catch (error) {
      console.error('Error fetching filter options:', error);
      // Ensure filter options remain in a valid state even on error
      setFilterOptions(prev => ({
        ...prev,
        branches: prev.branches || [],
        positions: prev.positions || [],
        grades: prev.grades || []
      }));
    }
  };
  // Fetch employees data
  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      
      if (!token) {
        alert('You are not authenticated. Please login again.');
        return;
      }

      // Build query parameters
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        per_page: perPage.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(filters.gender && { gender: filters.gender }),
        ...(filters.branch && { branch: filters.branch }),
        ...(filters.position && { position: filters.position }),
        ...(filters.contract_type && { contract_type: filters.contract_type }),
        ...(filters.last_education && { last_education: filters.last_education }),
        ...(filters.bank && { bank: filters.bank }),
        ...(filters.grade && { grade: filters.grade }),
        ...(filters.age_min && { age_min: filters.age_min }),
        ...(filters.age_max && { age_max: filters.age_max })
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/employees?${queryParams}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        }
      );      if (response.ok) {
        const result: ApiResponse = await response.json();
        
        // Add safety checks for the API response structure
        if (result?.data?.data && Array.isArray(result.data.data)) {
          setEmployees(result.data.data);
          setTotalEmployees(result.data.total || 0);
          setTotalPages(result.data.last_page || 1);          setStats(result.stats || {
            total_employees: 0,
            active_employees: 0,
            inactive_employees: 0,
            men_count: 0,
            women_count: 0,
            permanent_count: 0,
            contract_count: 0
          });
        } else {
          console.warn('Invalid API response structure:', result);
          setEmployees([]);
          setTotalEmployees(0);
          setTotalPages(1);
        }
      } else {
        console.error('Failed to fetch employees');
      }    } catch (error) {
      console.error('Error fetching employees:', error);
      // Set safe defaults on error
      setEmployees([]);
      setTotalEmployees(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [currentPage, perPage, searchTerm, filters]);

  // Initial load
  useEffect(() => {
    fetchFilterOptions();
  }, []);  // Fetch when dependencies change
  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage !== 1) {
        setCurrentPage(1);
      } else {
        fetchEmployees();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, currentPage, fetchEmployees]);

  // Handle filter change
  const handleFilterChange = (filterKey: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      gender: '',
      branch: '',
      position: '',
      contract_type: '',
      last_education: '',
      bank: '',
      grade: '',
      age_min: '',
      age_max: ''
    });
    setCurrentPage(1);
  };

  // Check if any filter is active
  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  // Handle delete employee
  const handleDelete = async (nik: string) => {
    if (!confirm('Are you sure you want to delete this employee?')) {
      return;
    }

    try {
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/employees/${nik}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        }
      );

      if (response.ok) {
        alert('Employee deleted successfully');
        fetchEmployees();
        fetchFilterOptions(); // Refresh filter options
      } else {
        const result = await response.json();
        alert(result.message || 'Failed to delete employee');
      }
    } catch (error) {
      console.error('Error deleting employee:', error);
      alert('Failed to delete employee');
    }
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    const start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    const end = Math.min(totalPages, start + maxVisible - 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  // Handle CSV import
  const handleImportFile = async () => {
    if (!importFile) {
      alert('Please select a CSV file to import');
      return;
    }

    setImportLoading(true);
    try {
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      
      if (!token) {
        alert('You are not authenticated. Please login again.');
        return;
      }

      const formData = new FormData();
      formData.append('file', importFile);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/employees/import`, // Sesuai dengan route
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        setImportResult(result);
        fetchEmployees(); // Refresh data
        fetchFilterOptions(); // Refresh filter options
      } else {
        setImportResult({
          success: false,
          message: result.message || 'Import failed',
          errors: result.errors || []
        });
      }
    } catch (error) {
      console.error('Error importing CSV:', error);
      setImportResult({
        success: false,
        message: 'Failed to import CSV file. Please check your connection and try again.',
        errors: []
      });
    } finally {
      setImportLoading(false);
    }
  };

  // Download CSV template
  const downloadTemplate = async () => {
    try {
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/employees/template/download`, // Sesuai dengan route
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        // Create download link
        const link = document.createElement('a');
        link.href = result.download_url;
        link.download = 'employee_import_template.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        alert(result.message || 'Failed to download template');
      }
    } catch (error) {
      console.error('Error downloading template:', error);
      alert('Failed to download template');
    }
  };

  // Reset import modal
  const resetImportModal = () => {
    setShowImportModal(false);
    setImportFile(null);
    setImportResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-10 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading employees...</p>
        </div>
      </div>
    );
  }
  return (
    <AuthWrapper requireAdmin={true}>
      <DashboardLayout>
        <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-7xl mx-auto px-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Total Employees</h3>
            <p className="text-2xl font-bold text-blue-600">{stats.total_employees}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Men / Women</h3>
            <p className="text-2xl font-bold text-green-600">{stats.men_count} / {stats.women_count}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Permanent</h3>
            <p className="text-2xl font-bold text-purple-600">{stats.permanent_count}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Contract</h3>
            <p className="text-2xl font-bold text-orange-600">{stats.contract_count}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
            <h2 className="text-lg font-semibold whitespace-nowrap">All Employees Information</h2>

            <div className="flex flex-wrap gap-2">
              <input
                type="text"
                placeholder="Search Employee"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-2 border rounded-md focus:ring focus:border-blue-300"
              />
              <button 
                onClick={() => setShowFilter(!showFilter)}
                className={`px-4 py-2 rounded hover:bg-gray-300 ${
                  showFilter ? 'bg-blue-200 text-blue-700' : 'bg-gray-200'
                } ${hasActiveFilters ? 'ring-2 ring-blue-400' : ''}`}
              >
                Filter {hasActiveFilters && `(${Object.values(filters).filter(v => v).length})`}
              </button>
              <button 
                onClick={() => setShowImportModal(true)}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Import
              </button>
              <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Export</button>
              <Link href="new-employee/">
                <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 whitespace-nowrap">
                  + Add Data
                </button>
              </Link>
            </div>
          </div>

          {/* Filter Panel */}
          {showFilter && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-md font-medium">Filter Options</h3>
                <div className="flex gap-2">
                  <button
                    onClick={clearFilters}
                    className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded"
                    disabled={!hasActiveFilters}
                  >
                    Clear All
                  </button>
                  <button
                    onClick={() => setShowFilter(false)}
                    className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded"
                  >
                    Close
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Gender Filter */}
                <div>
                  <label className="block text-sm font-medium mb-1">Gender</label>
                  <select
                    value={filters.gender}
                    onChange={(e) => handleFilterChange('gender', e.target.value)}
                    className="w-full border rounded px-2 py-1 text-sm"
                  >
                    <option value="">All Genders</option>
                    {filterOptions.genders.map(gender => (
                      <option key={gender} value={gender}>{gender}</option>
                    ))}
                  </select>
                </div>

                {/* Branch Filter */}
                <div>
                  <label className="block text-sm font-medium mb-1">Branch</label>
                  <select
                    value={filters.branch}
                    onChange={(e) => handleFilterChange('branch', e.target.value)}
                    className="w-full border rounded px-2 py-1 text-sm"
                  >
                    <option value="">All Branches</option>
                    {filterOptions.branches.map(branch => (
                      <option key={branch} value={branch}>{branch}</option>
                    ))}
                  </select>
                </div>

                {/* Position Filter */}
                <div>
                  <label className="block text-sm font-medium mb-1">Position</label>
                  <select
                    value={filters.position}
                    onChange={(e) => handleFilterChange('position', e.target.value)}
                    className="w-full border rounded px-2 py-1 text-sm"
                  >
                    <option value="">All Positions</option>
                    {filterOptions.positions.map(position => (
                      <option key={position} value={position}>{position}</option>
                    ))}
                  </select>
                </div>

                {/* Contract Type Filter */}
                <div>
                  <label className="block text-sm font-medium mb-1">Contract Type</label>
                  <select
                    value={filters.contract_type}
                    onChange={(e) => handleFilterChange('contract_type', e.target.value)}
                    className="w-full border rounded px-2 py-1 text-sm"
                  >
                    <option value="">All Types</option>
                    {filterOptions.contractTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* Education Filter */}
                <div>
                  <label className="block text-sm font-medium mb-1">Education</label>
                  <select
                    value={filters.last_education}
                    onChange={(e) => handleFilterChange('last_education', e.target.value)}
                    className="w-full border rounded px-2 py-1 text-sm"
                  >
                    <option value="">All Education</option>
                    {filterOptions.educations.map(education => (
                      <option key={education} value={education}>{education}</option>
                    ))}
                  </select>
                </div>

                {/* Bank Filter */}
                <div>
                  <label className="block text-sm font-medium mb-1">Bank</label>
                  <select
                    value={filters.bank}
                    onChange={(e) => handleFilterChange('bank', e.target.value)}
                    className="w-full border rounded px-2 py-1 text-sm"
                  >
                    <option value="">All Banks</option>
                    {filterOptions.banks.map(bank => (
                      <option key={bank} value={bank}>{bank}</option>
                    ))}
                  </select>
                </div>

                {/* Grade Filter */}
                <div>
                  <label className="block text-sm font-medium mb-1">Grade</label>
                  <select
                    value={filters.grade}
                    onChange={(e) => handleFilterChange('grade', e.target.value)}
                    className="w-full border rounded px-2 py-1 text-sm"
                  >
                    <option value="">All Grades</option>
                    {filterOptions.grades.map(grade => (
                      <option key={grade} value={grade}>{grade}</option>
                    ))}
                  </select>
                </div>

                {/* Age Range Filter */}
                <div>
                  <label className="block text-sm font-medium mb-1">Age Range</label>
                  <div className="flex gap-1">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.age_min}
                      onChange={(e) => handleFilterChange('age_min', e.target.value)}
                      className="w-full border rounded px-2 py-1 text-sm"
                      min="18"
                      max="100"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.age_max}
                      onChange={(e) => handleFilterChange('age_max', e.target.value)}
                      className="w-full border rounded px-2 py-1 text-sm"
                      min="18"
                      max="100"
                    />
                  </div>
                </div>
              </div>

              {/* Active Filters Display */}
              {hasActiveFilters && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm font-medium mb-2">Active Filters:</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(filters).map(([key, value]) => {
                      if (!value) return null;
                      return (
                        <span
                          key={key}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs"
                        >
                          {key.replace('_', ' ')}: {value}
                          <button
                            onClick={() => handleFilterChange(key, '')}
                            className="hover:text-blue-900"
                          >
                            ×
                          </button>
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2">No.</th>
                  <th className="p-2">Avatar</th>
                  <th className="p-2">NIK</th>
                  <th className="p-2">Name</th>
                  <th className="p-2">Gender</th>
                  <th className="p-2">Phone Number</th>
                  <th className="p-2">Branch</th>
                  <th className="p-2">Position</th>
                  <th className="p-2">Grade</th>
                  <th className="p-2">Contract Type</th>
                  <th className="p-2">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {employees.length > 0 ? (
                  employees.map((emp, index) => (
                    <tr key={emp.nik}>
                      <td className="p-2">{(currentPage - 1) * perPage + index + 1}</td>
                      <td className="p-2">
                        {emp.avatar_url ? (
                          <img 
                            src={emp.avatar_url} 
                            alt={emp.full_name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-blue-800 flex items-center justify-center text-white text-xs">
                            {emp.first_name.charAt(0)}{emp.last_name.charAt(0)}
                          </div>
                        )}
                      </td>
                      <td className="p-2 font-mono">{emp.nik}</td>
                      <td className="p-2">{emp.full_name}</td>
                      <td className="p-2">
                        <span
                          className={`px-2 py-1 rounded-full text-white text-xs ${
                            emp.gender === 'Men' ? 'bg-blue-500' : 'bg-rose-500'
                          }`}
                        >
                          {emp.gender}
                        </span>
                      </td>
                      <td className="p-2">{emp.mobile_phone}</td>
                      <td className="p-2">{emp.branch}</td>
                      <td className="p-2">{emp.position}</td>
                      <td className="p-2">{emp.grade}</td>
                      <td className="p-2">
                        <span
                          className={`px-2 py-1 rounded-full text-white text-xs ${
                            emp.contract_type === 'Permanent' ? 'bg-green-500' : 'bg-yellow-500'
                          }`}
                        >
                          {emp.contract_type}
                        </span>
                      </td>
                      <td className="p-2 flex space-x-2">
                        <Link href={`employee-detail/${emp.nik}`}>
                          <button className="p-1 bg-green-500 hover:bg-green-600 text-white rounded" title="View Details">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          </button>
                        </Link>
                        <Link href={`edit-employee/${emp.nik}`}>
                          <button className="p-1 bg-yellow-400 hover:bg-yellow-500 text-white rounded" title="Edit">
                            ✎
                          </button>
                        </Link>
                        <button 
                          onClick={() => handleDelete(emp.nik)}
                          className="p-1 bg-red-500 hover:bg-red-600 text-white rounded" 
                          title="Delete"
                        >
                          🗑
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={11} className="p-8 text-center text-gray-500">
                      {hasActiveFilters ? 'No employees found matching the filters' : 'No employees found'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <span>Showing</span>
              <select 
                value={perPage} 
                onChange={(e) => {
                  setPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border rounded px-1 py-0.5"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span>out of {totalEmployees} records</span>
              {hasActiveFilters && <span className="text-blue-600">(filtered)</span>}
            </div>
            
            {totalPages > 1 && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-2 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                {getPageNumbers().map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-2 py-1 border rounded ${
                      currentPage === page ? 'bg-blue-500 text-white' : ''
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-2 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Import Modal */}
        {showImportModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Import Employees from CSV</h3>
                <button
                  onClick={resetImportModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {!importResult ? (
                <>
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">
                      Upload a CSV file with employee data. Make sure your file follows the correct format.
                    </p>
                    <button
                      onClick={downloadTemplate}
                      className="text-blue-600 hover:text-blue-800 text-sm underline"
                    >
                      Download CSV Template
                    </button>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Select CSV File</label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv,.txt"
                      onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>

                  <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                    <h4 className="font-medium text-yellow-800 mb-2">CSV Format Requirements:</h4>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• NIK must be exactly 16 digits</li>
                      <li>• Gender: Men or Woman</li>
                      <li>• Education: SMA/SMK Sederajat, S1, or S2</li>
                      <li>• Contract Type: Permanent or Contract</li>
                      <li>• Bank: BCA, BNI, BRI, BSI, BTN, CMIB, Mandiri, or Permata</li>
                      <li>• Date format: YYYY-MM-DD</li>
                      <li>• All fields are required except letter_id</li>
                    </ul>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={resetImportModal}
                      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
                      disabled={importLoading}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleImportFile}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded disabled:opacity-50"
                      disabled={!importFile || importLoading}
                    >
                      {importLoading ? 'Importing...' : 'Import'}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className={`mb-4 p-4 rounded ${
                    importResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                  }`}>
                    <h4 className={`font-medium mb-2 ${
                      importResult.success ? 'text-green-800' : 'text-red-800'
                    }`}>
                      Import Results
                    </h4>
                    <p className={`text-sm ${
                      importResult.success ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {importResult.message}
                    </p>
                    
                    {importResult.data && (
                      <div className="mt-2 text-sm text-gray-600">
                        <p>• Imported: {importResult.data.imported} employees</p>
                        <p>• Failed: {importResult.data.failed} rows</p>
                        <p>• Total processed: {importResult.data.total_rows} rows</p>
                      </div>
                    )}
                  </div>

                  {importResult.errors && importResult.errors.length > 0 && (
                    <div className="mb-4">
                      <h5 className="font-medium text-red-800 mb-2">Errors:</h5>
                      <div className="max-h-40 overflow-y-auto bg-red-50 p-3 rounded border">
                        {importResult.errors.map((error: string, index: number) => (
                          <p key={index} className="text-sm text-red-700 mb-1">
                            {error}
                          </p>
                        ))}                        {importResult.total_errors && importResult.total_errors > importResult.errors.length && (
                          <p className="text-sm text-red-600 font-medium">
                            ... and {importResult.total_errors - importResult.errors.length} more errors
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {importResult.duplicates && importResult.duplicates.length > 0 && (
                    <div className="mb-4">
                      <h5 className="font-medium text-yellow-800 mb-2">Duplicate NIKs found:</h5>
                      <div className="bg-yellow-50 p-3 rounded border">
                        <p className="text-sm text-yellow-700">
                          {importResult.duplicates.join(', ')}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={resetImportModal}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => {
                        setImportResult(null);
                        setImportFile(null);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = '';
                        }
                      }}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
                    >
                      Import Another File
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>        )}
      </div>
    </div>
      </DashboardLayout>
    </AuthWrapper>
  );
}