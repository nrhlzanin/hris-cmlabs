'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ClockIcon,
  UserIcon,
  CalendarIcon,
  FileTextIcon,
  DownloadIcon
} from 'lucide-react';
import { format } from 'date-fns';
import { OvertimeRecord } from './OvertimeList';

interface OvertimeApprovalDialogProps {
  overtime: OvertimeRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (overtimeId: number, notes?: string) => void;
  onReject: (overtimeId: number, notes: string) => void;
  onDownloadDocument?: (overtimeId: number) => void;
  isLoading?: boolean;
}

export const OvertimeApprovalDialog: React.FC<OvertimeApprovalDialogProps> = ({
  overtime,
  isOpen,
  onClose,
  onApprove,
  onReject,
  onDownloadDocument,
  isLoading = false
}) => {
  const [action, setAction] = useState<'approve' | 'reject' | null>(null);
  const [notes, setNotes] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleActionClick = (actionType: 'approve' | 'reject') => {
    setAction(actionType);
    setShowConfirmDialog(true);
  };

  const handleConfirmAction = () => {
    if (!overtime || !action) return;

    if (action === 'approve') {
      onApprove(overtime.id, notes.trim() || undefined);
    } else {
      onReject(overtime.id, notes.trim() || 'Request rejected by admin');
    }

    // Reset state
    setAction(null);
    setNotes('');
    setShowConfirmDialog(false);
    onClose();
  };

  const handleCancel = () => {
    setAction(null);
    setNotes('');
    setShowConfirmDialog(false);
  };

  const formatDuration = (hours: number): string => {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    
    if (minutes === 0) {
      return `${wholeHours} hours`;
    }
    return `${wholeHours} hours ${minutes} minutes`;
  };

  const formatDate = (dateString: string): string => {
    return format(new Date(dateString), 'EEEE, MMMM dd, yyyy');
  };

  const formatTime = (timeString: string): string => {
    return format(new Date(`2000-01-01T${timeString}`), 'h:mm a');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <CheckCircleIcon className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-800">
            <XCircleIcon className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <ClockIcon className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
    }
  };

  if (!overtime) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ClockIcon className="h-5 w-5" />
              Overtime Request Details
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Employee Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <UserIcon className="h-5 w-5" />
                Employee Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Name</Label>
                  <p className="text-sm">{overtime.user?.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Employee ID</Label>
                  <p className="text-sm">{overtime.user?.employee?.nik}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Position</Label>
                  <p className="text-sm">{overtime.user?.employee?.position}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Status</Label>
                  <div className="mt-1">
                    {getStatusBadge(overtime.status)}
                  </div>
                </div>
              </div>
            </div>

            {/* Overtime Details */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Overtime Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Date</Label>
                  <p className="text-sm">{formatDate(overtime.overtime_date)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Duration</Label>
                  <p className="text-sm font-semibold text-blue-600">
                    {formatDuration(overtime.duration_hours)}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Start Time</Label>
                  <p className="text-sm">{formatTime(overtime.start_time)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">End Time</Label>
                  <p className="text-sm">{formatTime(overtime.end_time)}</p>
                </div>
                <div className="md:col-span-2">
                  <Label className="text-sm font-medium text-gray-600">Request Date</Label>
                  <p className="text-sm">{format(new Date(overtime.created_at), 'MMMM dd, yyyy \'at\' h:mm a')}</p>
                </div>
              </div>
            </div>

            {/* Reason and Tasks */}
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-600">Reason for Overtime</Label>
                <div className="mt-2 p-3 bg-gray-50 rounded-md">
                  <p className="text-sm whitespace-pre-wrap">{overtime.reason}</p>
                </div>
              </div>

              {overtime.tasks_completed && (
                <div>
                  <Label className="text-sm font-medium text-gray-600">Tasks to be Completed</Label>
                  <div className="mt-2 p-3 bg-gray-50 rounded-md">
                    <p className="text-sm whitespace-pre-wrap">{overtime.tasks_completed}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Supporting Document */}
            {overtime.supporting_document && (
              <div>
                <Label className="text-sm font-medium text-gray-600">Supporting Document</Label>
                <div className="mt-2 p-3 bg-gray-50 rounded-md flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileTextIcon className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Document attached</span>
                  </div>
                  {onDownloadDocument && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDownloadDocument(overtime.id)}
                    >
                      <DownloadIcon className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Previous Approval Information */}
            {overtime.status !== 'pending' && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-3">Approval Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Approved/Rejected By</Label>
                    <p className="text-sm">{overtime.approver?.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Date</Label>
                    <p className="text-sm">
                      {overtime.approved_at && format(new Date(overtime.approved_at), 'MMMM dd, yyyy \'at\' h:mm a')}
                    </p>
                  </div>
                  {overtime.admin_notes && (
                    <div className="md:col-span-2">
                      <Label className="text-sm font-medium text-gray-600">Admin Notes</Label>
                      <div className="mt-2 p-3 bg-white rounded-md border">
                        <p className="text-sm whitespace-pre-wrap">{overtime.admin_notes}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Admin Notes Input (for pending requests) */}
            {overtime.status === 'pending' && (
              <div>
                <Label htmlFor="admin_notes" className="text-sm font-medium text-gray-600">
                  Admin Notes (Optional)
                </Label>
                <Textarea
                  id="admin_notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes for the employee (optional)..."
                  rows={3}
                  className="mt-2"
                />
                <p className="text-xs text-gray-500 mt-1">
                  These notes will be visible to the employee and stored in the system.
                </p>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              Close
            </Button>
            
            {overtime.status === 'pending' && (
              <>
                <Button
                  variant="destructive"
                  onClick={() => handleActionClick('reject')}
                  disabled={isLoading}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <XCircleIcon className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button
                  onClick={() => handleActionClick('approve')}
                  disabled={isLoading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircleIcon className="h-4 w-4 mr-2" />
                  Approve
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              {action === 'approve' ? (
                <CheckCircleIcon className="h-5 w-5 text-green-600" />
              ) : (
                <XCircleIcon className="h-5 w-5 text-red-600" />
              )}
              Confirm {action === 'approve' ? 'Approval' : 'Rejection'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to <strong>{action}</strong> this overtime request for{' '}
              <strong>{overtime.user?.name}</strong>?
              {action === 'reject' && !notes.trim() && (
                <span className="block mt-2 text-orange-600">
                  Consider adding a note to explain the rejection reason.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel} disabled={isLoading}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmAction}
              disabled={isLoading}
              className={action === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
            >
              {isLoading ? 'Processing...' : `Confirm ${action === 'approve' ? 'Approval' : 'Rejection'}`}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
