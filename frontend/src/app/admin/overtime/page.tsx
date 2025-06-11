'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { overtimeService, type OvertimeRecord } from '@/services/overtime';

export default function AdminOvertimePage() {
  const [records, setRecords] = useState<OvertimeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<OvertimeRecord | null>(null);
  const [isDetailOpen, setDetailOpen] = useState(false);
  const [isApproveOpen, setApproveOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await overtimeService.getOvertimeRecords({ per_page: 50 });
      setRecords(res.data);
    } catch {
      toast({ title: 'Error', description: 'Failed to load records' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  const openDetail = (rec: OvertimeRecord) => {
    setSelected(rec);
    setDetailOpen(true);
  };

  const openApprove = (rec: OvertimeRecord) => {
    setSelected(rec);
    setApproveOpen(true);
  };

  const submitApproval = async (status: 'approved' | 'rejected') => {
    if (!selected) return;
    setSubmitting(true);
    try {
      await overtimeService.updateOvertimeStatus(selected.id, { status, admin_remarks: '' });
      toast({ title: 'Success', description: `Request ${status}` });
      setApproveOpen(false);
      load();
    } catch {
      toast({ title: 'Error', description: `Failed to ${status}` });
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Clock className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Overtime Overview</h1>
      <ul className="space-y-2">
        {records.map(rec => (
          <li key={rec.id} className="border p-4 rounded flex justify-between items-center">
            <div>
              <p className="font-semibold">{rec.employee.name}</p>
              <p className="text-sm text-gray-600">{rec.date}</p>
            </div>
            <div className="flex items-center gap-2">
              {renderIcon(rec.status)}
              <Button size="sm" onClick={() => openDetail(rec)}>Detail</Button>
              <Button size="sm" variant="secondary" disabled={rec.status !== 'pending'} onClick={() => openApprove(rec)}>
                Approve
              </Button>
            </div>
          </li>
        ))}
      </ul>

      {/* Approve Modal */}
      <Dialog open={isApproveOpen} onOpenChange={setApproveOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Approve or Reject</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <p><strong>Employee:</strong> {selected.employee.name}</p>
              <p><strong>Date:</strong> {selected.date}</p>
              <div className="flex gap-4">
                <Button
                  onClick={() => submitApproval('approved')}
                  disabled={submitting}
                  className="bg-green-600 hover:bg-green-700 flex-1"
                >
                  {submitting ? <Clock className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle className="h-4 w-4 mr-2" />} Approve
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => submitApproval('rejected')}
                  disabled={submitting}
                  className="flex-1"
                >
                  {submitting ? <Clock className="h-4 w-4 animate-spin mr-2" /> : <XCircle className="h-4 w-4 mr-2" />} Reject
                </Button>
              </div>
              <Button variant="outline" onClick={() => setApproveOpen(false)}>Cancel</Button>
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
          {selected && (
            <div className="space-y-2">
              <p><strong>Employee:</strong> {selected.employee.name}</p>
              <p><strong>Date:</strong> {selected.date}</p>
              <p><strong>Start Time:</strong> {formatJakartaTime(new Date(`1970-01-01T${selected.start_time}`))}</p>
              <p><strong>End Time:</strong> {selected.end_time ? formatJakartaTime(new Date(`1970-01-01T${selected.end_time}`)) : 'N/A'}</p>
              <p><strong>Reason:</strong> {selected.reason || '-'}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
