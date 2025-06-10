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
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Overtime Management</h1>
        <Badge variant="outline" className="text-sm">
          {overtimeRecords.length} records
        </Badge>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium">Search Employee</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or employee ID"
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-9"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Status</label>
              <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Date From</label>
              <Input
                type="date"
                value={filters.date_from}
                onChange={(e) => setFilters(prev => ({ ...prev, date_from: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Date To</label>
              <Input
                type="date"
                value={filters.date_to}
                onChange={(e) => setFilters(prev => ({ ...prev, date_to: e.target.value }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Overtime Records */}
      {overtimeRecords.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No overtime records found</h3>
            <p className="text-muted-foreground">
              No overtime requests match your current filters.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {overtimeRecords.map((record) => (
            <Card key={record.id} className={isIncomplete(record) ? 'border-yellow-200 bg-yellow-50' : ''}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5" />
                    <div>
                      <span className="font-medium">{record.employee?.name || 'Unknown Employee'}</span>
                      <p className="text-sm text-muted-foreground">{record.employee?.employee_id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(record.status)}
                    <Badge variant={getStatusVariant(record.status)}>
                      {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Date</p>
                    <p className="font-medium">{formatJakartaDate(new Date(record.date), { 
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })} WIB</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Start Time</p>
                    <p className="font-medium">{formatTime(record.start_time)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">End Time</p>
                    <p className="font-medium">
                      {record.end_time ? formatTime(record.end_time) : (
                        <span className="text-yellow-600">Pending completion</span>
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Duration</p>
                    <p className="font-medium">
                      {record.duration_hours ? `${record.duration_hours} hours` : (
                        <span className="text-yellow-600">Pending</span>
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Type</p>
                    <p className="font-medium capitalize">{record.overtime_type}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-muted-foreground mb-1">Reason</p>
                  <p className="text-sm">{record.reason}</p>
                </div>

                {isIncomplete(record) && (
                  <div className="border border-yellow-300 bg-yellow-50 p-3 rounded-lg mb-4">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm font-medium text-yellow-700">
                        Overtime not completed by employee yet
                      </span>
                    </div>
                    <p className="text-xs text-yellow-600 mt-1">
                      Employee needs to upload completion evidence before this can be approved.
                    </p>
                  </div>
                )}

                <div className="flex gap-2 pt-4 border-t">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewDetail(record)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                  
                  {canApprove(record) && (
                    <>
                      <Button 
                        size="sm"
                        onClick={() => handleApprovalAction(record)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleApprovalAction(record)}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </>
                  )}
                  
                  {record.status === 'pending' && isIncomplete(record) && (
                    <Badge variant="outline" className="text-yellow-600">
                      Waiting for completion
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      <Dialog open={detailModalOpen} onOpenChange={setDetailModalOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Overtime Details</DialogTitle>
          </DialogHeader>
          {selectedRecord && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Employee</p>
                  <p className="font-medium">{selectedRecord.employee?.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedRecord.employee?.employee_id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Department</p>
                  <p className="font-medium">{selectedRecord.employee?.department || 'N/A'}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Date</p>
                  <p className="font-medium">{new Date(selectedRecord.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Overtime Type</p>
                  <p className="font-medium capitalize">{selectedRecord.overtime_type}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Start Time</p>
                  <p className="font-medium">{formatTime(selectedRecord.start_time)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">End Time</p>
                  <p className="font-medium">{formatTime(selectedRecord.end_time)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Duration</p>
                  <p className="font-medium">
                    {selectedRecord.duration_hours ? `${selectedRecord.duration_hours} hours` : 'N/A'}
                  </p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Reason</p>
                <p className="text-sm bg-gray-50 p-3 rounded">{selectedRecord.reason}</p>
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
        </DialogContent>
      </Dialog>
    </div>
  );
}
