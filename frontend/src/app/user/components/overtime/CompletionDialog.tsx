'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Clock, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { overtimeService, type OvertimeRecord } from '@/services/overtime';
import { getJakartaTimeString } from '@/lib/timezone';
import FileUpload from '@/app/user/components/ui/FileUpload';

interface CompletionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  overtimeRecord: OvertimeRecord | null;
  onSuccess: () => void;
}

export const CompletionDialog: React.FC<CompletionDialogProps> = ({ isOpen, onOpenChange, overtimeRecord, onSuccess }) => {
  const [endTime, setEndTime] = useState('');
  const [tasksCompleted, setTasksCompleted] = useState('');
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setEndTime(getJakartaTimeString());
      setTasksCompleted('');
      setDocumentFile(null);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!overtimeRecord || !endTime) {
      toast({ title: 'Error', description: 'End time is required.' });
      return;
    }

    setIsSubmitting(true);
    try {
      await overtimeService.completeOvertime(overtimeRecord.id, {
        end_time: endTime,
        tasks_completed: tasksCompleted,
        supporting_document: documentFile || undefined,
      });
      toast({ title: 'Success', description: 'Overtime completed successfully.' });
      onSuccess();
      onOpenChange(false);
    } catch {
      toast({ title: 'Error', description: 'Failed to complete overtime.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg flex flex-col max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Complete Overtime</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4 overflow-y-auto px-1">
          <div>
            <Label htmlFor="end_time">End Time *</Label>
            <Input id="end_time" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
          </div>
          
          <div>
            <Label htmlFor="supporting_document">Supporting Document</Label>
            <FileUpload onFileAccepted={setDocumentFile} />
          </div>

          <div>
            <Label htmlFor="tasks_completed">Tasks Completed</Label>
            <Textarea id="tasks_completed" value={tasksCompleted} onChange={(e) => setTasksCompleted(e.target.value)} placeholder="Describe tasks completed..." />
          </div>
        </div>
        
        <DialogFooter className="flex-shrink-0">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || !endTime}>
            {isSubmitting ? (
              <><Clock className="h-4 w-4 mr-2 animate-spin" /> Submitting...</>
            ) : (
              <><CheckCircle className="h-4 w-4 mr-2" /> Complete</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};