'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Clock, Upload, CheckCircle, XCircle, Calendar, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { overtimeService, type OvertimeRecord } from '@/services/overtime';
import { formatJakartaDate, formatJakartaTime, getJakartaTimeString } from '@/lib/timezone';
import DashboardLayout from '@/components/layout/DashboardLayout';
import AuthWrapper from '@/components/auth/AuthWrapper';

export default function UserOvertimePage() {
  const [overtimeRecords, setOvertimeRecords] = useState<OvertimeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [completionDialogOpen, setCompletionDialogOpen] = useState(false);
  const [selectedOvertime, setSelectedOvertime] = useState<OvertimeRecord | null>(null);
  const [completionData, setCompletionData] = useState({
    end_time: '',
    tasks_completed: '',
    supporting_document: null as File | null
  });  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();  // Simple direct function without useCallback complexities
  const loadOvertimeRecords = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Direct database fetch
      const response = await overtimeService.getOvertimeRecords({
        per_page: 100,
        sort_by: 'overtime_date',
        sort_order: 'desc'
      });
      
      setOvertimeRecords(response.data);
    } catch (err: any) {
      console.error('Failed to load overtime records:', err);
      const errorMessage = err.message || 'Failed to load overtime records';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadOvertimeRecords();
  }, []); // No dependencies, just load once
  const handleCompleteOvertime = (overtime: OvertimeRecord) => {
    setSelectedOvertime(overtime);
    setCompletionData({
      end_time: getJakartaTimeString(), // Set current Jakarta time as default
      tasks_completed: '',
      supporting_document: null
    });
    setCompletionDialogOpen(true);
  };

  const handleSubmitCompletion = async () => {
    if (!selectedOvertime || !completionData.end_time) {      toast({
        title: 'Error',
        description: 'End time is required',
      });
      return;
    }

    try {
      setSubmitting(true);
      await overtimeService.completeOvertime(selectedOvertime.id, {
        end_time: completionData.end_time,
        tasks_completed: completionData.tasks_completed,
        supporting_document: completionData.supporting_document || undefined
      });

      toast({
        title: 'Success',
        description: 'Overtime completed successfully',
      });      setCompletionDialogOpen(false);
      loadOvertimeRecords();    } catch {
      toast({
        title: 'Error',
        description: 'Failed to complete overtime',
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
  };  if (loading) {
    return (
      <AuthWrapper requireAdmin={false}>
        <DashboardLayout>
          <div className="container mx-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold">My Overtime</h1>
            </div>
            
            {/* Ultra simple loading - direct from database */}
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <div className="h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Loading dari database...</p>
              </div>
            </div>
          </div>
        </DashboardLayout>
      </AuthWrapper>
    );
  }

  return (
    <AuthWrapper requireAdmin={false}>
      <DashboardLayout>
        <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">My Overtime</h1>
        <Badge variant="outline" className="text-sm">
          {overtimeRecords.length} records
        </Badge>
      </div>
      
      {error && !loading ? (
        <Card>
          <CardContent className="text-center py-12">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
            <h3 className="text-lg font-medium mb-2">Failed to load overtime records</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={loadOvertimeRecords} variant="outline">
              <Clock className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      ) : overtimeRecords.length === 0 && !loading ? (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No overtime records found</h3>
            <p className="text-muted-foreground">
              Your overtime requests will appear here once submitted.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {overtimeRecords.map((record) => (
            <Card key={record.id} className={isIncomplete(record) ? 'border-yellow-200 bg-yellow-50' : ''}>
              <CardHeader>                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    <span>{formatJakartaDate(new Date(record.date), { 
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })} WIB</span>
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
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

                {record.tasks_completed && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-muted-foreground mb-1">Tasks Completed</p>
                    <p className="text-sm">{record.tasks_completed}</p>
                  </div>
                )}

                {record.supporting_document_url && (
                  <div className="mb-4">
                    <Button variant="outline" size="sm" asChild>
                      <a href={record.supporting_document_url} target="_blank" rel="noopener noreferrer">
                        <FileText className="h-4 w-4 mr-2" />
                        View Document
                      </a>
                    </Button>
                  </div>
                )}
                
                {isIncomplete(record) && record.status !== 'rejected' && (
                  <div className="border-t pt-4">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm font-medium text-yellow-600">
                        Complete your overtime by uploading evidence
                      </span>
                    </div>
                    <Button 
                      onClick={() => handleCompleteOvertime(record)} 
                      className="w-full sm:w-auto"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Complete Overtime
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Completion Dialog */}
      <Dialog open={completionDialogOpen} onOpenChange={setCompletionDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Overtime</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="end_time">End Time *</Label>
              <Input
                id="end_time"
                type="time"
                value={completionData.end_time}
                onChange={(e) => setCompletionData(prev => ({ ...prev, end_time: e.target.value }))}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="supporting_document">Supporting Document</Label>
              <Input
                id="supporting_document"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => setCompletionData(prev => ({ 
                  ...prev, 
                  supporting_document: e.target.files?.[0] || null 
                }))}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Upload evidence of your overtime work (PDF, JPG, PNG)
              </p>
            </div>
            
            <div>
              <Label htmlFor="tasks_completed">Tasks Completed (Optional)</Label>
              <Textarea
                id="tasks_completed"
                value={completionData.tasks_completed}
                onChange={(e) => setCompletionData(prev => ({ ...prev, tasks_completed: e.target.value }))}
                placeholder="Describe what tasks were completed during overtime..."
                rows={3}
              />
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button 
                onClick={handleSubmitCompletion} 
                disabled={submitting || !completionData.end_time}
                className="flex-1"
              >
                {submitting ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Complete
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setCompletionDialogOpen(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
            </div>
          </div>        </DialogContent>
      </Dialog>
    </div>
      </DashboardLayout>
    </AuthWrapper>
  );
}
