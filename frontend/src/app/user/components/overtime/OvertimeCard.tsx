'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Clock, Upload, CheckCircle, XCircle, Calendar, AlertCircle } from 'lucide-react';
import { type OvertimeRecord } from '@/services/overtime';
import { formatJakartaDate, formatJakartaTime } from '@/lib/timezone';

interface OvertimeCardProps {
  record: OvertimeRecord;
  onComplete: (record: OvertimeRecord) => void;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'approved': return <CheckCircle className="h-5 w-5 text-green-500" />;
    case 'rejected': return <XCircle className="h-5 w-5 text-red-500" />;
    case 'pending': return <Clock className="h-5 w-5 text-yellow-500" />;
    default: return <AlertCircle className="h-5 w-5 text-blue-500" />;
  }
};

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'approved': return 'default' as const;
    case 'rejected': return 'destructive' as const;
    case 'pending': return 'secondary' as const;
    default: return 'outline' as const;
  }
};

const formatTime = (timeString: string | null) => {
  if (!timeString) return 'Not set';
  return formatJakartaTime(new Date(`1970-01-01T${timeString}`));
};

const isIncomplete = (record: OvertimeRecord) => !record.end_time;

export const OvertimeCard: React.FC<OvertimeCardProps> = ({ record, onComplete }) => {
  return (
    <Card className={isIncomplete(record) ? 'border-yellow-300 bg-yellow-50/50' : ''}>
      <CardHeader>
        <CardTitle className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-base">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <span>{formatJakartaDate(new Date(record.overtime_date), { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-center">
            {getStatusIcon(record.status)}
            <Badge variant={getStatusVariant(record.status)}>{record.status}</Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Start Time</p>
            <p className="font-semibold">{formatTime(record.start_time)}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">End Time</p>
            <p className="font-semibold">{record.end_time ? formatTime(record.end_time) : <span className="text-yellow-600">Pending</span>}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Duration</p>
            <p className="font-semibold">{record.duration_hours ? `${record.duration_hours} hours` : <span className="text-yellow-600">Pending</span>}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Type</p>
            <p className="font-semibold capitalize">{record.overtime_type}</p>
          </div>
        </div>
        <div className="mb-4 pt-4 border-t">
          <p className="text-sm font-medium text-muted-foreground mb-1">Reason</p>
          <p className="text-sm text-gray-800">{record.reason}</p>
        </div>
        {record.tasks_completed && (
          <div className="mb-4">
            <p className="text-sm font-medium text-muted-foreground mb-1">Tasks Completed</p>
            <p className="text-sm text-gray-800">{record.tasks_completed}</p>
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
        {isIncomplete(record) && record.status === 'approved' && (
          <div className="border-t pt-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-700">
                This overtime needs to be completed.
              </span>
            </div>
            <Button onClick={() => onComplete(record)} className="w-full sm:w-auto">
              <Upload className="h-4 w-4 mr-2" /> Complete Overtime
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};