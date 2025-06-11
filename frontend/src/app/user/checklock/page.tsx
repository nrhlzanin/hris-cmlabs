// app/checklock/overview/page.tsx (assuming this is your page file)
'use client';

import { useState } from 'react';
import Link from 'next/link';
<<<<<<< HEAD
import { overtimeService, type OvertimeFormData } from '@/services/overtime';
import { useToast } from '@/hooks/use-toast';
import { getJakartaDateString, formatJakartaDate, WORKING_HOURS } from '@/lib/timezone';
import DashboardLayout from '@/components/layout/DashboardLayout';
import AuthWrapper from '@/components/auth/AuthWrapper';
=======
import OvertimeRequestModal from '@/app/components/User/checklock/OvertimeRequestModal'; // Import the new component
>>>>>>> b34488116d69d94048fe117e0f0b84b5481c3319

export default function ChecklockOverview() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter states
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    status: '',
    workHoursMin: '',
    workHoursMax: ''
  });
  // Sample data with more entries for filtering
  const attendanceData = [
    {
      id: 1,
      date: 'March 01, 2025',
      clockIn: '09:28 AM',
      clockOut: '04:00 PM',
      workHours: '10h 5m',
      status: 'On Time',
      statusColor: 'green'
    },
    {
      id: 2,
      date: 'March 02, 2025',
      clockIn: '09:30 AM',
      clockOut: '04:30 PM',
      workHours: '8h 50m',
      status: 'Late',
      statusColor: 'red'
    },
    {
      id: 3,
      date: 'March 03, 2025',
      clockIn: '08:45 AM',
      clockOut: '05:15 PM',
      workHours: '9h 30m',
      status: 'On Time',
      statusColor: 'green'
    },
    {
      id: 4,
      date: 'March 04, 2025',
      clockIn: '10:15 AM',
      clockOut: '04:45 PM',
      workHours: '7h 30m',
      status: 'Late',
      statusColor: 'red'
    }
  ];

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      dateFrom: '',
      dateTo: '',
      status: '',
      workHoursMin: '',
      workHoursMax: ''
    });
    setSearchTerm('');
  };

  // Filter function
  const filteredData = attendanceData.filter(item => {
    const matchesSearch = searchTerm === '' ||
      item.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.status.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filters.status === '' || item.status === filters.status;

    // Convert date for comparison
    const itemDate = new Date(item.date);
    const fromDate = filters.dateFrom ? new Date(filters.dateFrom) : null;
    const toDate = filters.dateTo ? new Date(filters.dateTo) : null;

    const matchesDateRange = (!fromDate || itemDate >= fromDate) &&
      (!toDate || itemDate <= toDate);

    // TODO: Implement work hours filtering logic based on 'workHoursMin' and 'workHoursMax'
    // For now, it only checks for search, status, and date range.
    // You'll need to parse 'item.workHours' (e.g., '10h 5m') into a comparable number (e.g., minutes or hours)
    // and then compare with filters.workHoursMin and filters.workHoursMax.

    return matchesSearch && matchesStatus && matchesDateRange;
  });
  return (
    <AuthWrapper requireAdmin={false}>
      <DashboardLayout>
        <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Checklock Overview</h2>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Search Employee"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 border rounded-md focus:ring focus:border-blue-300"
            />
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Filter
            </button>
            <Link href="absensi/">
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">+ Add Data</button>
            </Link>
          </div>
        </div>

        {/* Filter Panel */}
        {isFilterOpen && (
          <div className="bg-gray-50 p-4 rounded-lg mb-4 border">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date From</label>
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:ring focus:border-blue-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date To</label>
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:ring focus:border-blue-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:ring focus:border-blue-300"
                >
                  <option value="">All Status</option>
                  <option value="On Time">On Time</option>
                  <option value="Late">Late</option>
                  <option value="Absent">Absent</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Work Hours</label>
                <input
                  type="number"
                  placeholder="8"
                  value={filters.workHoursMin}
                  onChange={(e) => handleFilterChange('workHoursMin', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:ring focus:border-blue-300"
                />
              </div>
              <div className="flex items-end space-x-2">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Clear
                </button>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">Date</th>
                <th className="p-2">Clock In</th>
                <th className="p-2">Clock Out</th>
                <th className="p-2">Work Hours</th>
                <th className="p-2 text-center">Status</th>
                <th className="p-2 text-center">Overtime</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr key={item.id}>
                    <td className="p-2">{item.date}</td>
                    <td className="p-2">{item.clockIn}</td>
                    <td className="p-2">{item.clockOut}</td>
                    <td className="p-2">{item.workHours}</td>
                    <td className="p-2 text-center">
                      <span className={`${item.statusColor === 'green' ? 'bg-green-500' : 'bg-red-600'} text-white px-2 py-1 rounded-full text-xs`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="p-2 text-center">
                      <button
                        onClick={openModal}
                        className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
                        title="Request Overtime"
                      >
                        Request OT
                      </button>                    </td>
                  </tr>
<<<<<<< HEAD
                ))) : (
=======
                ))
              ) : (
>>>>>>> b34488116d69d94048fe117e0f0b84b5481c3319
                <tr>
                  <td colSpan={6} className="p-4 text-center text-gray-500">
                    No data found matching your filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
          <div>
            Showing
            <select className="border rounded px-1 py-0.5 ml-1">
              <option>10</option>
            </select>
            out of {filteredData.length} records
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-2 py-1 border rounded">1</button>
            <button className="px-2 py-1 border rounded bg-blue-500 text-white">2</button>
            <button className="px-2 py-1 border rounded">3</button>
          </div>
        </div>
      </div>

<<<<<<< HEAD
              <div>
                <label className="text-sm text-gray-700 block mb-1">Overtime Type <span className="text-red-500">*</span></label>
                <select
                  value={overtimeType}
                  onChange={(e) => setOvertimeType(e.target.value as 'regular' | 'holiday' | 'weekend')}
                  className="w-full px-3 py-2 border rounded-md focus:ring focus:border-blue-300"
                  required
                >
                  <option value="regular">Regular Day</option>
                  <option value="weekend">Weekend</option>
                  <option value="holiday">Holiday</option>
                </select>
              </div>
              
              <div>
                <label className="text-sm text-gray-700 block mb-1">Reason <span className="text-red-500">*</span></label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:ring focus:border-blue-300 resize-none"
                  placeholder="Describe the reason for overtime work..."
                  rows={3}
                  required
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                <div className="flex items-start">
                  <div className="text-blue-600 mr-2">ℹ️</div>
                  <div>
                    <p className="text-sm text-blue-800 font-medium">Important Note:</p>                    <p className="text-xs text-blue-700 mt-1">
                      You can complete this overtime request later by uploading completion evidence and end time in the &quot;My Overtime&quot; page.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-800 text-white rounded hover:bg-blue-900 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>        </div>
      </div>
      )}
=======
      <OvertimeRequestModal isOpen={isModalOpen} onClose={closeModal} />
>>>>>>> b34488116d69d94048fe117e0f0b84b5481c3319
    </div>
      </DashboardLayout>
    </AuthWrapper>
  );
}