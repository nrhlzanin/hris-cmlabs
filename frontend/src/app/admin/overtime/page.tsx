'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Clock, CheckCircle, XCircle, AlertCircle, Search, Filter, Eye, User, Calendar, Timer } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { overtimeService, type OvertimeRecord } from '@/services/overtime';
import { formatJakartaDate, formatJakartaTime } from '@/lib/timezone';
import DashboardLayout from '@/components/layout/DashboardLayout';
import AuthWrapper from '@/components/auth/AuthWrapper';

export default function AdminOvertimePage() {
  const [records, setRecords] = useState<OvertimeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState<OvertimeRecord | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    date_from: '',
    date_to: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setLoading(true);
      const response = await overtimeService.getOvertimeRecords({
        search: filters.search || undefined,
        status: (filters.status as 'pending' | 'approved' | 'rejected') || undefined,
        date_from: filters.date_from || undefined,
        date_to: filters.date_to || undefined,
        per_page: 50
      });
      setOvertimeRecords(response.data);    } catch (error) {
      console.error('Error loading overtime records:', error);
      toast({
        title: 'Error',
        description: 'Failed to load overtime records',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  const handleViewDetail = (record: OvertimeRecord) => {
    setSelectedRecord(record);
    setDetailModalOpen(true);
  };

  const handleApprovalAction = (record: OvertimeRecord) => {
    setSelectedRecord(record);
    setApprovalModalOpen(true);
  };

  const openApprove = (rec: OvertimeRecord) => {
    setSelected(rec);
    setApproveOpen(true);
  };

  const submitApproval = async (status: 'approved' | 'rejected') => {
    if (!selected) return;
    setSubmitting(true);
    try {
      setSubmitting(true);
      await overtimeService.updateOvertimeStatus(selectedRecord.id, {
        status,
        admin_remarks: remarks
      });

      toast({
        title: 'Success',
        description: `Overtime request ${status} successfully`,
      });
      setApprovalModalOpen(false);
      loadOvertimeRecords();    } catch (error) {
      console.error('Error updating overtime status:', error);
      toast({
        title: 'Error',
        description: `Failed to ${status === 'approved' ? 'approve' : 'reject'} overtime request`,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const renderIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected': return <XCircle className="h-5 w-5 text-red-500" />;
      case 'pending': return <Clock className="h-5 w-5 text-yellow-500" />;
      default: return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'approved':
        return 'default' as const;
      case 'rejected':
        return 'destructive' as const;
      case 'pending':
        return 'secondary' as const;
      default:
        return 'outline' as const;
    }
  };

  const formatTime = (timeString: string | null) => {
    if (!timeString) return 'Not set';
    const date = new Date(`1970-01-01T${timeString}`);
    return formatJakartaTime(date);
  };

  const isIncomplete = (overtime: OvertimeRecord) => {
    return !overtime.end_time;
  };

  const canApprove = (overtime: OvertimeRecord) => {
    return overtime.status === 'pending' && !isIncomplete(overtime);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };
  // Filter records based on search
  const filteredRecords = overtimeRecords.filter(record => {
    const searchLower = filters.search.toLowerCase();
    return (
      record.employee?.name?.toLowerCase().includes(searchLower) ||
      record.employee?.employee_id?.toLowerCase().includes(searchLower) ||
      record.reason?.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Clock className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }
  return (
    <AuthWrapper requireAdmin={true}>
      <DashboardLayout>
        <div className="min-h-screen bg-gray-100 py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow overflow-hidden">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Overtime Management</h1>
                <p className="text-gray-600 mt-1">Review and approve overtime requests</p>
              </div>
              <div className="flex flex-wrap gap-2 items-center w-full sm:w-auto">
                <div className="relative w-full sm:w-auto">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search employee or purpose..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="w-full sm:w-64 pl-10"
                  />
                </div>
                <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                  <SelectTrigger className="w-full sm:w-auto">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 pt-0">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <Clock className="h-8 w-8 text-yellow-500" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Pending</p>
                      <p className="text-2xl font-bold">{overtimeRecords.filter(r => r.status === 'pending').length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <CheckCircle className="h-8 w-8 text-green-500" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Approved</p>
                      <p className="text-2xl font-bold">{overtimeRecords.filter(r => r.status === 'approved').length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <XCircle className="h-8 w-8 text-red-500" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Rejected</p>
                      <p className="text-2xl font-bold">{overtimeRecords.filter(r => r.status === 'rejected').length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <Timer className="h-8 w-8 text-blue-500" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total</p>
                      <p className="text-2xl font-bold">{overtimeRecords.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employee
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration
                    </th>                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reason
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRecords.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                        No overtime records found
                      </td>
                    </tr>
                  ) : (
                    filteredRecords.map((record) => (
                      <tr key={record.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <User className="h-6 w-6 text-gray-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {record.employee?.name || 'Unknown'}
                              </div>
                              <div className="text-sm text-gray-500">
                                ID: {record.employee?.employee_id || 'N/A'}
                              </div>
                            </div>
                          </div>
                        </td>                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatJakartaDate(new Date(record.overtime_date || record.date))}
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatTime(record.start_time)} - {formatTime(record.end_time)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {record.duration_hours ? `${record.duration_hours} hours` : 'Incomplete'}
                          </div>
                        </td>                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-xs truncate" title={record.reason}>
                            {record.reason || 'No reason specified'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={getStatusVariant(record.status)} className="flex items-center gap-1 w-fit">
                            {getStatusIcon(record.status)}
                            {record.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewDetail(record)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            {canApprove(record) && (
                              <Button
                                size="sm"
                                onClick={() => handleApprovalAction(record)}
                              >
                                Review
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <Button variant="outline" disabled>
                  Previous
                </Button>
                <Button variant="outline" disabled>
                  Next
                </Button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">1</span> to{' '}
                    <span className="font-medium">{filteredRecords.length}</span> of{' '}
                    <span className="font-medium">{filteredRecords.length}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <Button variant="outline" disabled className="rounded-l-md">
                      Previous
                    </Button>
                    <Button variant="outline" disabled className="rounded-r-md">
                      Next
                    </Button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <Dialog open={detailModalOpen} onOpenChange={setDetailModalOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Overtime Request Details</DialogTitle>
          </DialogHeader>
          {selectedRecord && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Employee</p>
                  <p className="text-sm font-semibold">{selectedRecord.employee?.name}</p>
                  <p className="text-xs text-gray-500">ID: {selectedRecord.employee?.employee_id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Status</p>
                  <Badge variant={getStatusVariant(selectedRecord.status)} className="flex items-center gap-1 w-fit">
                    {getStatusIcon(selectedRecord.status)}
                    {selectedRecord.status}
                  </Badge>
                </div>                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Date</p>
                  <p className="text-sm">{formatJakartaDate(new Date(selectedRecord.overtime_date || selectedRecord.date))}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Duration</p>
                  <p className="text-sm">{selectedRecord.duration_hours ? `${selectedRecord.duration_hours} hours` : 'Incomplete'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Start Time</p>
                  <p className="text-sm">{formatTime(selectedRecord.start_time)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">End Time</p>
                  <p className="text-sm">{formatTime(selectedRecord.end_time)}</p>
                </div>
              </div>
                {selectedRecord.reason && (
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Reason</p>
                  <p className="text-sm bg-gray-50 p-3 rounded">{selectedRecord.reason}</p>
                </div>
              )}
              
              {selectedRecord.tasks_completed && (
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Tasks Completed</p>
                  <p className="text-sm bg-gray-50 p-3 rounded">{selectedRecord.tasks_completed}</p>
                </div>
              )}
              
              {selectedRecord.supporting_document_url && (
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Supporting Document</p>
                  <Button variant="outline" size="sm" asChild>
                    <a href={selectedRecord.supporting_document_url} target="_blank" rel="noopener noreferrer">
                      <FileText className="h-4 w-4 mr-2" />
                      View Document
                    </a>
                  </Button>
                </div>
              )}
              
              {selectedRecord.admin_remarks && (
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Admin Remarks</p>
                  <p className="text-sm bg-blue-50 p-3 rounded border-l-4 border-blue-400">
                    {selectedRecord.admin_remarks}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Detail Modal */}
      <Dialog open={isDetailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Record Detail</DialogTitle>
          </DialogHeader>
          {selectedRecord && (
            <div className="space-y-4">              <div className="text-sm">
                <p><strong>Employee:</strong> {selectedRecord.employee?.name}</p>
                <p><strong>Date:</strong> {formatJakartaDate(new Date(selectedRecord.overtime_date || selectedRecord.date))}</p>
                <p><strong>Duration:</strong> {selectedRecord.duration_hours} hours</p>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={() => handleSubmitApproval('approved')}
                  disabled={submitting}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  {submitting ? (
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <CheckCircle className="h-4 w-4 mr-2" />
                  )}
                  Approve
                </Button>
                <Button 
                  variant="destructive"
                  onClick={() => handleSubmitApproval('rejected')}
                  disabled={submitting}
                  className="flex-1"
                >
                  {submitting ? (
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <XCircle className="h-4 w-4 mr-2" />
                  )}
                  Reject
                </Button>
              </div>
              
              <Button 
                variant="outline" 
                onClick={() => setApprovalModalOpen(false)}
                disabled={submitting}
                className="w-full"
              >              Cancel
              </Button>
            </div>
          )}        </DialogContent>
      </Dialog>
      </DashboardLayout>
    </AuthWrapper>
  );
}
