'use client';

import { useState } from 'react';
import { overtimeService } from '@/services/overtime';
import { useToast } from '@/hooks/use-toast';
import { formatJakartaDate } from '@/lib/timezone';
import { FaTimes } from 'react-icons/fa';
import FileUpload from '@/app/user/components/ui/FileUpload';

interface OvertimeRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  recordId: number | null;
}

export default function OvertimeRequestModal({ isOpen, onClose, recordId }: OvertimeRequestModalProps) {
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
  const [endTime, setEndTime] = useState('');
  const [completionNotes, setCompletionNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleFileAccepted = (file: File) => {
    setEvidenceFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!evidenceFile || !endTime || !completionNotes.trim()) {
      toast({ title: 'Error', description: 'Please fill all fields and upload evidence.' });
      return;
    }
    
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('overtime_id', String(recordId)); // Menggunakan ID dari record presensi
      formData.append('end_time', endTime);
      formData.append('completion_notes', completionNotes.trim());
      formData.append('evidence_file', evidenceFile);

      await overtimeService.updateOvertimeCompletion(formData);

      toast({ title: 'Success', description: 'Overtime completion data submitted successfully!' });
      onClose();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to submit overtime completion.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    // Backdrop dengan scroll
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      {/* Panel Modal yang bisa di-scroll */}
      <div className="bg-white rounded-lg w-full max-w-lg shadow-xl max-h-[90vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center flex-shrink-0">
          <h3 className="text-lg font-semibold">Overtime Form</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
            <FaTimes className="w-4 h-4 text-gray-500" />
          </button>
        </div>
        
        {/* Form dengan overflow-y-auto untuk scrolling */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
          <div>
            <label className="text-sm text-gray-700 block mb-1 font-medium">Date</label>
            <p className="text-gray-800">
              {formatJakartaDate(new Date(), { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <div>
            <label className="text-sm text-gray-700 block mb-2 font-medium">Upload Supporting Evidence</label>
            <FileUpload onFileAccepted={handleFileAccepted} />
          </div>

          <div>
            <label className="text-sm text-gray-700 block mb-1 font-medium">Time Sending (End Time)</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-700 block mb-1 font-medium">Finish or Not? (Completion Notes)</label>
            <textarea
              value={completionNotes}
              onChange={(e) => setCompletionNotes(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none"
              placeholder="Enter completion notes..."
              rows={3}
              required
            />
          </div>
        </form>

        {/* Footer Tombol */}
        <div className="p-4 border-t flex-shrink-0 flex justify-center">
          <button
            type="submit"
            onClick={handleSubmit} // Trigger submit dari tombol ini
            disabled={isSubmitting}
            className="w-full sm:w-auto px-12 py-2.5 bg-blue-800 text-white font-semibold rounded-md hover:bg-blue-900 disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );
}