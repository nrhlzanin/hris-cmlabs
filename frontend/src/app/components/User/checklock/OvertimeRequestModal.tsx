// components/OvertimeRequestModal.tsx
import { useState } from 'react';
import { overtimeService, type OvertimeFormData } from '@/services/overtime';
import { useToast } from '@/hooks/use-toast';
import { getJakartaDateString, formatJakartaDate, WORKING_HOURS } from '@/lib/timezone';

interface OvertimeRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OvertimeRequestModal({ isOpen, onClose }: OvertimeRequestModalProps) {
  const [reason, setReason] = useState('');
  const [sendTime, setSendTime] = useState(WORKING_HOURS.OVERTIME_START);
  const [overtimeType, setOvertimeType] = useState<'regular' | 'holiday' | 'weekend'>('regular');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!reason.trim()) {
      toast({
        title: 'Error',
        description: 'Please provide a reason for overtime',
      });
      return;
    }

    if (!sendTime) {
      toast({
        title: 'Error',
        description: 'Please select a start time for overtime',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const formData: OvertimeFormData = {
        overtime_date: getJakartaDateString(), // Today's date in Jakarta timezone (YYYY-MM-DD format)
        start_time: sendTime, // Already in HH:MM format from time input
        overtime_type: overtimeType,
        reason: reason.trim(),
      };

      await overtimeService.createOvertime(formData);

      toast({
        title: 'Success',
        description: 'Overtime request submitted successfully! Complete it later by uploading evidence in the "My Overtime" page.',
      });

      // Reset form and close modal
      setReason('');
      setSendTime(WORKING_HOURS.OVERTIME_START); // Reset to default overtime start time
      setOvertimeType('regular');
      onClose();
    } catch (error) {
      console.error('Failed to submit overtime request:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit overtime request. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Overtime Request Form</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-700 block mb-1">Date</label>
            <p className="text-gray-800 px-3 py-2 bg-gray-50 rounded-md">
              {formatJakartaDate(new Date(), {
                year: 'numeric',
                month: 'long',
                day: '2-digit',
                weekday: 'long'
              })} (WIB)
            </p>
          </div>

          <div>
            <label className="text-sm text-gray-700 block mb-1">Start Time <span className="text-red-500">*</span></label>
            <input
              type="time"
              value={sendTime}
              onChange={(e) => setSendTime(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:ring focus:border-blue-300"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Select when you will start working overtime</p>
          </div>

          <div>
            <label className="text-sm text-gray-700 block mb-1">Overtime Type <span className="text-red-500">*</span></label>
            <select
              value={overtimeType}
              onChange={(e) => setOvertimeType(e.target.value as 'regular' | 'holiday' | 'weekend')}
              className="w-full px-3 py-2 border rounded-md focus:ring focus:border-blue-300"
              required
            >
              <option value="regular">Regular Day</option>
              <option value="weekend">Weekend</option>
              <option value="holiday">Holiday</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-700 block mb-1">Reason <span className="text-red-500">*</span></label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:ring focus:border-blue-300 resize-none"
              placeholder="Describe the reason for overtime work..."
              rows={3}
              required
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <div className="flex items-start">
              <div className="text-blue-600 mr-2">ℹ️</div>
              <div>
                <p className="text-sm text-blue-800 font-medium">Important Note:</p>
                <p className="text-xs text-blue-700 mt-1">
                  You can complete this overtime request later by uploading completion evidence and end time in the &quot;My Overtime&quot; page.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-800 text-white rounded hover:bg-blue-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}