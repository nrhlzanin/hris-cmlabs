'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, AlertCircle, Clock } from 'lucide-react';
import { type OvertimeRecord } from '@/services/overtime';
import { OvertimeCard } from './OvertimeCard';

interface OvertimeListProps {
  loading: boolean;
  error: string | null;
  records: OvertimeRecord[];
  onCompleteOvertime: (record: OvertimeRecord) => void;
  onRetry: () => void;
}

const SkeletonCard = () => (
  <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 space-y-4 animate-pulse">
    <div className="flex justify-between items-center">
      <div className="h-5 bg-gray-200 rounded w-1/3"></div>
      <div className="h-6 bg-gray-200 rounded-full w-20"></div>
    </div>
    <div className="space-y-3 pt-4">
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
    </div>
  </div>
);

export const OvertimeList: React.FC<OvertimeListProps> = ({ loading, error, records, onCompleteOvertime, onRetry }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {[...Array(4)].map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="text-center py-12 flex flex-col items-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
          <h3 className="text-xl font-semibold mb-2">Failed to load data</h3>
          <p className="text-muted-foreground mb-4 max-w-sm">{error}</p>
          <Button onClick={onRetry} variant="outline">
            <Clock className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (records.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12 flex flex-col items-center">
          <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">No Overtime Records Found</h3>
          <p className="text-muted-foreground max-w-sm">
            Your approved overtime requests will appear here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      {records.map((record) => (
        <OvertimeCard key={record.id} record={record} onComplete={onCompleteOvertime} />
      ))}
    </div>
  );
};