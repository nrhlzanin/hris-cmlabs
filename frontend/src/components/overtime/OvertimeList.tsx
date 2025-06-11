'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ClockIcon, 
  SearchIcon, 
  CalendarIcon,
  UserIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon as PendingIcon,
  EditIcon,
  TrashIcon,
  DownloadIcon
} from 'lucide-react';
import { format } from 'date-fns';

export interface OvertimeRecord {
  id: number;
  user_id: number;
  overtime_date: string;
  start_time: string;
  end_time: string;
  duration_hours: number;
  reason: string;
  tasks_completed?: string;
  status: 'pending' | 'approved' | 'rejected';
  approved_by?: number;
  approved_at?: string;
  admin_notes?: string;
  supporting_document?: string;
  created_at: string;
  updated_at: string;
  user?: {
    id_users: number;
    name: string;
    employee?: {
      nik: string;
      first_name: string;
      last_name: string;
      position: string;
    };
  };
  approver?: {
    id_users: number;
    name: string;
  };
}

interface OvertimeListProps {
  data: OvertimeRecord[];
  isLoading?: boolean;  currentUser: {
    id: number;
    id_users: number;
    role: string;
    name: string;
  };
  onEdit?: (overtime: OvertimeRecord) => void;
  onDelete?: (overtimeId: number) => void;
  onApprove?: (overtimeId: number, notes?: string) => void;
  onReject?: (overtimeId: number, notes: string) => void;
  onDownloadDocument?: (overtimeId: number) => void;
  pagination?: {
    current_page: number;
    total_pages: number;
    total_items: number;
    per_page: number;
  };
  onPageChange?: (page: number) => void;
}

export const OvertimeList: React.FC<OvertimeListProps> = ({
  data,
  isLoading = false,
  currentUser,
  onEdit,
  onDelete,
  onApprove,
  onReject,
  onDownloadDocument,
  pagination,
  onPageChange
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-200">
            <CheckCircleIcon className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-200">
            <XCircleIcon className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
            <PendingIcon className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
    }
  };

  const formatDuration = (hours: number): string => {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    
    if (minutes === 0) {
      return `${wholeHours}h`;
    }
    return `${wholeHours}h ${minutes}m`;
  };

  const formatDate = (dateString: string): string => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  const formatTime = (timeString: string): string => {
    return format(new Date(`2000-01-01T${timeString}`), 'HH:mm');
  };

  const canEdit = (overtime: OvertimeRecord): boolean => {
    return overtime.status === 'pending' && overtime.user_id === currentUser?.id_users;
  };

  const canDelete = (overtime: OvertimeRecord): boolean => {
    return overtime.status === 'pending' && overtime.user_id === currentUser?.id_users;
  };

  const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'super_admin';

  const filteredData = data.filter(overtime => {
    const matchesSearch = searchTerm === '' || 
      overtime.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      overtime.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      overtime.user?.employee?.position?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || overtime.status === statusFilter;

    let matchesDate = true;
    if (dateFilter !== 'all') {
      const overtimeDate = new Date(overtime.overtime_date);
      const today = new Date();
      
      switch (dateFilter) {
        case 'today':
          matchesDate = overtimeDate.toDateString() === today.toDateString();
          break;
        case 'week':
          const weekAgo = new Date(today);
          weekAgo.setDate(today.getDate() - 7);
          matchesDate = overtimeDate >= weekAgo;
          break;
        case 'month':
          const monthAgo = new Date(today);
          monthAgo.setMonth(today.getMonth() - 1);
          matchesDate = overtimeDate >= monthAgo;
          break;
      }
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading overtime records...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClockIcon className="h-5 w-5" />
          Overtime Records
        </CardTitle>
        
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mt-4">
          <div className="flex-1">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by reason, employee, or position..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter by date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        {filteredData.length === 0 ? (
          <div className="text-center py-8">
            <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No overtime records found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter !== 'all' || dateFilter !== 'all'
                ? 'Try adjusting your filters.'
                : 'No overtime requests have been submitted yet.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {isAdmin && (
                    <TableHead>
                      <div className="flex items-center gap-1">
                        <UserIcon className="h-4 w-4" />
                        Employee
                      </div>
                    </TableHead>
                  )}
                  <TableHead>
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="h-4 w-4" />
                      Date
                    </div>
                  </TableHead>
                  <TableHead>Time Period</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((overtime) => (
                  <TableRow key={overtime.id}>
                    {isAdmin && (
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{overtime.user?.name}</span>
                          <span className="text-sm text-gray-500">
                            {overtime.user?.employee?.position}
                          </span>
                        </div>
                      </TableCell>
                    )}
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{formatDate(overtime.overtime_date)}</span>
                        <span className="text-sm text-gray-500">
                          {format(new Date(overtime.created_at), 'MMM dd, HH:mm')}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{formatTime(overtime.start_time)} - {formatTime(overtime.end_time)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{formatDuration(overtime.duration_hours)}</span>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <p className="truncate" title={overtime.reason}>
                          {overtime.reason}
                        </p>
                        {overtime.tasks_completed && (
                          <p className="text-sm text-gray-500 truncate" title={overtime.tasks_completed}>
                            Tasks: {overtime.tasks_completed}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {getStatusBadge(overtime.status)}
                        {overtime.approved_at && overtime.approver && (
                          <span className="text-xs text-gray-500">
                            by {overtime.approver.name}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {/* Supporting Document */}
                        {overtime.supporting_document && onDownloadDocument && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDownloadDocument(overtime.id)}
                            title="Download supporting document"
                          >
                            <DownloadIcon className="h-4 w-4" />
                          </Button>
                        )}

                        {/* Edit Button */}
                        {canEdit(overtime) && onEdit && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(overtime)}
                            title="Edit overtime request"
                          >
                            <EditIcon className="h-4 w-4" />
                          </Button>
                        )}

                        {/* Delete Button */}
                        {canDelete(overtime) && onDelete && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete(overtime.id)}
                            title="Delete overtime request"
                            className="text-red-600 hover:text-red-800"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        )}

                        {/* Admin Actions */}
                        {isAdmin && overtime.status === 'pending' && (
                          <>
                            {onApprove && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onApprove(overtime.id)}
                                title="Approve overtime request"
                                className="text-green-600 hover:text-green-800"
                              >
                                <CheckCircleIcon className="h-4 w-4" />
                              </Button>
                            )}
                            {onReject && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onReject(overtime.id, '')}
                                title="Reject overtime request"
                                className="text-red-600 hover:text-red-800"
                              >
                                <XCircleIcon className="h-4 w-4" />
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.total_pages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-500">
              Showing {((pagination.current_page - 1) * pagination.per_page) + 1} to{' '}
              {Math.min(pagination.current_page * pagination.per_page, pagination.total_items)} of{' '}
              {pagination.total_items} results
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange && onPageChange(pagination.current_page - 1)}
                disabled={pagination.current_page <= 1}
              >
                Previous
              </Button>
              <span className="text-sm">
                Page {pagination.current_page} of {pagination.total_pages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange && onPageChange(pagination.current_page + 1)}
                disabled={pagination.current_page >= pagination.total_pages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
