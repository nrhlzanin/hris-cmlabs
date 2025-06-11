'use client';

import React, { useState, useEffect } from 'react';
import { formatJakartaDate, formatJakartaDateTime, getJakartaTime } from '@/lib/timezone';
import { Search, Filter, Plus, X, Upload } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import AuthWrapper from '@/components/auth/AuthWrapper';

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
  const [letters, setLetters] = useState<Letter[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Form states for add letter modal
  const [formData, setFormData] = useState({
    employee: '',
    letterType: '',
    letterName: '',
    letterDescription: '',
    letterStatus: 'Active',
    validUntil: '',
    file: null as File | null
  });

  useEffect(() => {
    fetchLetters();
  }, []);

  const fetchLetters = async () => {
    try {
      // Mock data matching the wireframe structure
      const mockLetters: Letter[] = [
        {
          id: 1,
          letterName: 'SURAT SAKIT',
          letterType: 'Absence',
          letterDescription: 'Pak, saya sakit jadi tidak bisa masuk hari ini.',
          status: 'Approved',
          validUntil: '2025-08-15',
          fileName: 'surat_sakit.pdf',
          created_at: '2025-08-15T10:00:00Z'
        },
        {
          id: 2,
          letterName: 'Leave Request',
          letterType: 'Annual Leave',
          letterDescription: 'Request for annual leave vacation.',
          status: 'Pending',
          validUntil: '2025-08-19',
          fileName: 'leave_request.pdf',
          created_at: '2025-08-19T14:30:00Z'
        }
      ];
      setLetters(mockLetters);
    } catch (error) {
      console.error('Error fetching letters:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'text-green-600 bg-green-100';
      case 'rejected':
        return 'text-red-600 bg-red-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'active':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const handleInputChange = (field: string, value: string | File) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleInputChange('file', file);
    }
  };

  const handleSubmitLetter = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.letterType || !formData.letterName || !formData.letterDescription || !formData.validUntil) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      // Here you would normally send the data to your API
      const newLetter: Letter = {
        id: letters.length + 1,
        letterName: formData.letterName,
        letterType: formData.letterType,
        letterDescription: formData.letterDescription,
        status: 'Pending',
        validUntil: formData.validUntil,
        fileName: formData.file?.name,
        created_at: new Date().toISOString()
      };

      setLetters(prev => [newLetter, ...prev]);
      setIsAddModalOpen(false);
      
      // Reset form
      setFormData({
        employee: '',
        letterType: '',
        letterName: '',
        letterDescription: '',
        letterStatus: 'Active',
        validUntil: '',
        file: null
      });

      alert('Letter submitted successfully!');
    } catch (error) {
      console.error('Error submitting letter:', error);
      alert('Error submitting letter. Please try again.');
    }
  };

  const filteredLetters = letters.filter(letter =>
    letter.letterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    letter.letterType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    letter.letterDescription.toLowerCase().includes(searchTerm.toLowerCase())
  );  return (
    <AuthWrapper requireAdmin={false}>
      <DashboardLayout>
        <div className="min-h-screen bg-gray-50 p-6">
          <div className="bg-white rounded-lg shadow p-4">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Letter Overview</h1>
              <div className="text-sm text-gray-500">
                Current time: {formatJakartaDateTime(getJakartaTime())} WIB
              </div>
            </div>

            {/* Search and Actions */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search Employee"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <Filter className="h-4 w-4" />
                  <span>Filter</span>
                </button>
              </div>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
                <span>Add Letter</span>
              </button>
            </div>

            {/* Letters Table */}
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Letter Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Letter Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Letter Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredLetters.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                          No letters found
                        </td>
                      </tr>
                    ) : (
                      filteredLetters.map((letter) => (
                        <tr key={letter.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatJakartaDate(new Date(letter.created_at))}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {letter.letterName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {letter.letterType}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                            {letter.letterDescription}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(letter.status)}`}>
                              {letter.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
              <div>
                Showing <span className="border rounded px-1 py-0.5 ml-1">10</span> out of {filteredLetters.length} records
              </div>
              <div className="flex items-center space-x-2">
                <button className="px-2 py-1 border rounded">1</button>
                <button className="px-2 py-1 border rounded bg-blue-500 text-white">2</button>
                <button className="px-2 py-1 border rounded">3</button>
              </div>
            </div>
          </div>

          {/* Add Letter Modal */}
          {isAddModalOpen && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
              <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Add Letter</h3>
                  <button
                    onClick={() => setIsAddModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmitLetter} className="space-y-4">
                  {/* Employee */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Employee *
                    </label>
                    <select
                      value={formData.employee}
                      onChange={(e) => handleInputChange('employee', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Choose Employee</option>
                      <option value="current_user">Current User</option>
                    </select>
                  </div>

                  {/* Letter Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Letter Type *
                    </label>
                    <select
                      value={formData.letterType}
                      onChange={(e) => handleInputChange('letterType', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Choose Letter Type</option>
                      <option value="Absence">Absence</option>
                      <option value="Annual Leave">Annual Leave</option>
                      <option value="Sick Leave">Sick Leave</option>
                      <option value="Maternity Leave">Maternity Leave</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Letter Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Letter Name *
                    </label>
                    <input
                      type="text"
                      value={formData.letterName}
                      onChange={(e) => handleInputChange('letterName', e.target.value)}
                      placeholder="Enter letter name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  {/* Letter Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Letter Description
                    </label>
                    <textarea
                      value={formData.letterDescription}
                      onChange={(e) => handleInputChange('letterDescription', e.target.value)}
                      placeholder="Enter brief description (optional)"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Upload Letter File */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Upload Letter File
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
                      <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                      <input
                        type="file"
                        onChange={handleFileUpload}
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        className="hidden"
                        id="file-upload"
                      />
                      <label
                        htmlFor="file-upload"
                        className="cursor-pointer text-blue-600 hover:text-blue-800"
                      >
                        Click to upload
                      </label>
                      {formData.file && (
                        <p className="mt-2 text-sm text-gray-600">
                          {formData.file.name}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Letter Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Letter Status *
                    </label>
                    <select
                      value={formData.letterStatus}
                      onChange={(e) => handleInputChange('letterStatus', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>

                  {/* Valid Until */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Valid Until *
                    </label>
                    <input
                      type="date"
                      value={formData.validUntil}
                      onChange={(e) => handleInputChange('validUntil', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
                    >
                      Submit Letter
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </AuthWrapper>
  );
}