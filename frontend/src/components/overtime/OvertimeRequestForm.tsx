'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, ClockIcon, FileIcon, AlertCircleIcon } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface OvertimeRequestFormProps {
  onSubmit: (data: OvertimeFormData) => void;
  isLoading?: boolean;
}

export interface OvertimeFormData {
  overtime_date: string;
  start_time: string;
  end_time: string;
  reason: string;
  tasks_completed?: string;
  supporting_document?: File;
}

export const OvertimeRequestForm: React.FC<OvertimeRequestFormProps> = ({
  onSubmit,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<OvertimeFormData>({
    overtime_date: '',
    start_time: '',
    end_time: '',
    reason: '',
    tasks_completed: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [duration, setDuration] = useState<string>('');

  // Calculate duration when start_time or end_time changes
  const calculateDuration = (start: string, end: string) => {
    if (start && end) {
      const startTime = new Date(`2000-01-01T${start}`);
      const endTime = new Date(`2000-01-01T${end}`);
      
      if (endTime > startTime) {
        const diffMs = endTime.getTime() - startTime.getTime();
        const diffHours = diffMs / (1000 * 60 * 60);
        setDuration(`${diffHours.toFixed(2)} hours`);
      } else {
        setDuration('Invalid time range');
      }
    } else {
      setDuration('');
    }
  };

  const handleInputChange = (field: keyof OvertimeFormData, value: string) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Calculate duration for time fields
    if (field === 'start_time' || field === 'end_time') {
      calculateDuration(
        field === 'start_time' ? value : newFormData.start_time,
        field === 'end_time' ? value : newFormData.end_time
      );
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file size (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, file: 'File size must be less than 5MB' }));
        return;
      }
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!allowedTypes.includes(selectedFile.type)) {
        setErrors(prev => ({ ...prev, file: 'Only JPEG, PNG, and PDF files are allowed' }));
        return;
      }
      
      setFile(selectedFile);
      setErrors(prev => ({ ...prev, file: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.overtime_date) {
      newErrors.overtime_date = 'Overtime date is required';    } else {
      const selectedDate = new Date(formData.overtime_date);
      const today = new Date();
      const maxDate = new Date();
      maxDate.setDate(today.getDate() + 30); // Allow up to 30 days in advance
      
      const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());

      if (selectedDate < todayMidnight) {
        newErrors.overtime_date = 'Cannot select past dates';
      } else if (selectedDate > maxDate) {
        newErrors.overtime_date = 'Cannot select dates more than 30 days in advance';
      }
    }

    if (!formData.start_time) {
      newErrors.start_time = 'Start time is required';
    }

    if (!formData.end_time) {
      newErrors.end_time = 'End time is required';
    }

    if (formData.start_time && formData.end_time) {
      const startTime = new Date(`2000-01-01T${formData.start_time}`);
      const endTime = new Date(`2000-01-01T${formData.end_time}`);
      
      if (endTime <= startTime) {
        newErrors.end_time = 'End time must be after start time';
      }

      const diffMs = endTime.getTime() - startTime.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);
      
      if (diffHours > 12) {
        newErrors.end_time = 'Overtime duration cannot exceed 12 hours';
      }
    }

    if (!formData.reason.trim()) {
      newErrors.reason = 'Reason for overtime is required';
    } else if (formData.reason.trim().length < 10) {
      newErrors.reason = 'Reason must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const submitData = { ...formData };
    if (file) {
      submitData.supporting_document = file;
    }

    onSubmit(submitData);
  };

  const today = new Date().toISOString().split('T')[0];
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClockIcon className="h-5 w-5" />
          Request Overtime
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date and Time Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="overtime_date" className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                Overtime Date
              </Label>
              <Input
                id="overtime_date"
                type="date"
                value={formData.overtime_date}
                onChange={(e) => handleInputChange('overtime_date', e.target.value)}
                min={today}
                max={maxDateStr}
                className={errors.overtime_date ? 'border-red-500' : ''}
              />
              {errors.overtime_date && (
                <p className="text-sm text-red-500">{errors.overtime_date}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="start_time">Start Time</Label>
              <Input
                id="start_time"
                type="time"
                value={formData.start_time}
                onChange={(e) => handleInputChange('start_time', e.target.value)}
                className={errors.start_time ? 'border-red-500' : ''}
              />
              {errors.start_time && (
                <p className="text-sm text-red-500">{errors.start_time}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_time">End Time</Label>
              <Input
                id="end_time"
                type="time"
                value={formData.end_time}
                onChange={(e) => handleInputChange('end_time', e.target.value)}
                className={errors.end_time ? 'border-red-500' : ''}
              />
              {errors.end_time && (
                <p className="text-sm text-red-500">{errors.end_time}</p>
              )}
            </div>
          </div>

          {/* Duration Display */}
          {duration && (
            <Alert>
              <AlertCircleIcon className="h-4 w-4" />
              <AlertDescription>
                Duration: <strong>{duration}</strong>
              </AlertDescription>
            </Alert>
          )}

          {/* Reason Section */}
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Overtime *</Label>
            <Textarea
              id="reason"
              placeholder="Explain why overtime is necessary..."
              value={formData.reason}
              onChange={(e) => handleInputChange('reason', e.target.value)}
              rows={3}
              className={errors.reason ? 'border-red-500' : ''}
            />
            {errors.reason && (
              <p className="text-sm text-red-500">{errors.reason}</p>
            )}
          </div>

          {/* Tasks Completed Section */}
          <div className="space-y-2">
            <Label htmlFor="tasks_completed">Tasks to be Completed (Optional)</Label>
            <Textarea
              id="tasks_completed"
              placeholder="Describe the tasks you plan to complete during overtime..."
              value={formData.tasks_completed}
              onChange={(e) => handleInputChange('tasks_completed', e.target.value)}
              rows={3}
            />
          </div>

          {/* File Upload Section */}
          <div className="space-y-2">
            <Label htmlFor="supporting_document" className="flex items-center gap-2">
              <FileIcon className="h-4 w-4" />
              Supporting Document (Optional)
            </Label>
            <Input
              id="supporting_document"
              type="file"
              accept="image/jpeg,image/png,image/jpg,application/pdf"
              onChange={handleFileChange}
              className={errors.file ? 'border-red-500' : ''}
            />
            <p className="text-sm text-gray-500">
              Upload supporting documents (JPEG, PNG, PDF - Max 5MB)
            </p>
            {errors.file && (
              <p className="text-sm text-red-500">{errors.file}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full md:w-auto"
            >
              {isLoading ? 'Submitting...' : 'Submit Overtime Request'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
