'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Clock, CheckCircle, XCircle, AlertCircle, Search, Filter, Eye, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { overtimeService, type OvertimeRecord } from '@/services/overtime';
import { formatJakartaDate, formatJakartaTime } from '@/lib/timezone';

export default function AdminOvertimePage() {
  const [overtimeRecords, setOvertimeRecords] = useState<OvertimeRecord[]>([]);
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
  const [submitting, setSubmitting] = useState(false);  const { toast } = useToast();

  const loadOvertimeRecords = useCallback(async () => {
    try {
      setLoading(true);
      const response = await overtimeService.getOvertimeRecords({
        search: filters.search || undefined,
        status: (filters.status as 'pending' | 'approved' | 'rejected') || undefined,
        date_from: filters.date_from || undefined,
        date_to: filters.date_to || undefined,
        per_page: 50
      });      setOvertimeRecords(response.data);    } catch {
      toast({
        title: 'Error',
        description: 'Failed to load overtime records',
      });
    } finally {
      setLoading(false);
    }
  }, [filters, toast]);

  useEffect(() => {
    loadOvertimeRecords();
  }, [loadOvertimeRecords]);

  const handleViewDetail = (record: OvertimeRecord) => {
    setSelectedRecord(record);
    setDetailModalOpen(true);
  };
  const handleApprovalAction = (record: OvertimeRecord) => {
    setSelectedRecord(record);
    setApprovalModalOpen(true);
  };

  const handleSubmitApproval = async (status: 'approved' | 'rejected', remarks?: string) => {
    if (!selectedRecord) return;

    try {
      setSubmitting(true);
      await overtimeService.updateOvertimeStatus(selectedRecord.id, {
        status,
        admin_remarks: remarks
      });

      toast({
        title: 'Success',
        description: `Overtime request ${status} successfully`,
      });      setApprovalModalOpen(false);
      loadOvertimeRecords();    } catch {
      toast({
        title: 'Error',
        description: `Failed to ${status === 'approved' ? 'approve' : 'reject'} overtime request`,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-blue-500" />;
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
    // Create a date object with the time in Jakarta timezone
    const date = new Date(`1970-01-01T${timeString}`);
    return formatJakartaTime(date);
  };

  const isIncomplete = (overtime: OvertimeRecord) => {
    return !overtime.end_time;
  };

  const canApprove = (overtime: OvertimeRecord) => {
    return overtime.status === 'pending' && !isIncomplete(overtime);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Clock className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading overtime records...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-100 py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow overflow-hidden">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Overtime Overview</h1>
              <div className="flex flex-wrap gap-2 items-center w-full sm:w-auto">
                <div className="relative w-full sm:w-auto">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    placeholder="Search Employee"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full sm:w-60 pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <button className="border px-4 py-2 rounded-lg bg-white hover:bg-gray-100 text-sm">Filter</button>
                <button
                  onClick={() => setFormModalOpen(true)}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm"
                >
                  Add Data
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr className="text-gray-600">
                    <th className="px-4 md:px-6 py-3 md:py-4 text-left">Employee Name</th>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-left">Position</th>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-left">Branch</th>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-left">Grade</th>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-left">Status</th>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-center">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredEmployees.map((emp) => (
                    <tr key={emp.id} className="hover:bg-gray-50">
                      <td className="px-4 md:px-6 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                          <div>
                            <div className="font-semibold text-gray-800">{emp.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-3 whitespace-nowrap">{emp.position}</td>
                      <td className="px-4 md:px-6 py-3 whitespace-nowrap">{emp.branch}</td>
                      <td className="px-4 md:px-6 py-3 whitespace-nowrap">{emp.grade}</td>
                      <td className="px-4 md:px-6 py-3 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor[emp.status]}`}>
                          {emp.status}
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-3 text-center">
                        <button
                          onClick={() => handleViewDetails(emp)}
                          className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs hover:bg-blue-700"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-4 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600 gap-2">
              <span>
                Showing 1 to {filteredEmployees.length} out of 60 records
              </span>
              <div className="flex items-center gap-2">
                <button className="px-2 py-1 rounded bg-gray-200 text-gray-600" disabled>{'<'}</button>
                <span>1</span>
                <button className="px-2 py-1 rounded bg-gray-200 text-gray-600" disabled>{'>'}</button>
              </div>
              
              {selectedRecord.tasks_completed && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Tasks Completed</p>
                  <p className="text-sm bg-gray-50 p-3 rounded">{selectedRecord.tasks_completed}</p>
                </div>
              )}
              
              {selectedRecord.supporting_document_url && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Supporting Document</p>
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
                  <p className="text-sm font-medium text-muted-foreground mb-1">Admin Remarks</p>
                  <p className="text-sm bg-blue-50 p-3 rounded border-l-4 border-blue-400">
                    {selectedRecord.admin_remarks}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Approval Modal */}
      <Dialog open={approvalModalOpen} onOpenChange={setApprovalModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Approve/Reject Overtime</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-sm">
              <p><strong>Employee:</strong> {selectedRecord?.employee?.name}</p>
              <p><strong>Date:</strong> {selectedRecord ? new Date(selectedRecord.date).toLocaleDateString() : ''}</p>
              <p><strong>Duration:</strong> {selectedRecord?.duration_hours} hours</p>
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
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>


      <DetailModal isOpen={detailModalOpen} onClose={() => setDetailModalOpen(false)} data={detailData} employee={selectedEmployee} />
      <FormModal isOpen={formModalOpen} onClose={() => setFormModalOpen(false)} />
    </>
  );
}