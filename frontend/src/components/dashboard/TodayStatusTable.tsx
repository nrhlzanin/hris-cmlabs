import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { dashboardService, TodayStatus } from '@/services/dashboard';
import { Users, CheckCircle, XCircle, Clock, AlertTriangle, Search } from 'lucide-react';

export function TodayStatusTable() {
  const [statusData, setStatusData] = useState<TodayStatus[]>([]);
  const [filteredData, setFilteredData] = useState<TodayStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchTodayStatus();
    // Update every 2 minutes
    const interval = setInterval(fetchTodayStatus, 120000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let filtered = statusData;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(employee =>
        employee.employee_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(employee => employee.status === statusFilter);
    }

    setFilteredData(filtered);
  }, [statusData, searchTerm, statusFilter]);

  const fetchTodayStatus = async () => {
    try {
      setError(null);
      const data = await dashboardService.getTodayStatus();
      setStatusData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch today status');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'absent':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'late':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'early_leave':
        return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      default:
        return <XCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 'present':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'absent':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'late':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'early_leave':
        return `${baseClasses} bg-orange-100 text-orange-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const formatTime = (timeString: string | null) => {
    if (!timeString) return '—';
    try {
      const date = new Date(timeString);
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return timeString;
    }
  };

  const getStatusCounts = () => {
    return {
      present: statusData.filter(emp => emp.status === 'present').length,
      absent: statusData.filter(emp => emp.status === 'absent').length,
      late: statusData.filter(emp => emp.status === 'late').length,
      early_leave: statusData.filter(emp => emp.status === 'early_leave').length,
    };
  };

  const statusCounts = getStatusCounts();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Today's Employee Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="flex space-x-4 mb-4">
              <div className="h-10 bg-gray-300 rounded w-64"></div>
              <div className="h-10 bg-gray-300 rounded w-32"></div>
            </div>
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-300 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center text-red-600">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Today's Employee Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-600 text-sm mb-3">
            {error}
          </div>
          <button 
            onClick={fetchTodayStatus}
            className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
          >
            Retry
          </button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Today's Employee Status
          </CardTitle>
          <div className="text-sm text-gray-500">
            {statusData.length} employees
          </div>
        </div>
        
        {/* Status Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
          <div className="text-center p-2 bg-green-50 rounded">
            <div className="text-lg font-bold text-green-600">{statusCounts.present}</div>
            <div className="text-xs text-green-600">Present</div>
          </div>
          <div className="text-center p-2 bg-red-50 rounded">
            <div className="text-lg font-bold text-red-600">{statusCounts.absent}</div>
            <div className="text-xs text-red-600">Absent</div>
          </div>
          <div className="text-center p-2 bg-yellow-50 rounded">
            <div className="text-lg font-bold text-yellow-600">{statusCounts.late}</div>
            <div className="text-xs text-yellow-600">Late</div>
          </div>
          <div className="text-center p-2 bg-orange-50 rounded">
            <div className="text-lg font-bold text-orange-600">{statusCounts.early_leave}</div>
            <div className="text-xs text-orange-600">Early Leave</div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="present">Present</option>
            <option value="absent">Absent</option>
            <option value="late">Late</option>
            <option value="early_leave">Early Leave</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-2 font-medium text-gray-700">Employee</th>
                <th className="text-left py-3 px-2 font-medium text-gray-700">Status</th>
                <th className="text-left py-3 px-2 font-medium text-gray-700">Check In</th>
                <th className="text-left py-3 px-2 font-medium text-gray-700">Check Out</th>
                <th className="text-left py-3 px-2 font-medium text-gray-700">Work Hours</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-500">
                    {statusData.length === 0 ? 'No employee data available' : 'No employees match your filter'}
                  </td>
                </tr>
              ) : (
                filteredData.map((employee) => (
                  <tr key={employee.employee_id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-2">
                      <div className="font-medium text-gray-900">{employee.employee_name}</div>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(employee.status)}
                        <span className={getStatusBadge(employee.status)}>
                          {employee.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-gray-600">
                      {formatTime(employee.check_in)}
                    </td>
                    <td className="py-3 px-2 text-gray-600">
                      {formatTime(employee.check_out)}
                    </td>
                    <td className="py-3 px-2 text-gray-600">
                      {employee.work_hours || '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {filteredData.length > 0 && (
          <div className="mt-4 text-xs text-gray-500 text-center">
            Showing {filteredData.length} of {statusData.length} employees
          </div>
        )}
      </CardContent>
    </Card>
  );
}
