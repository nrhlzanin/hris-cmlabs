import React, { useState } from "react";
import { AdminAttendanceRecord } from '@/services/attendance';

interface ApprovalModalProps {
  isOpen: boolean;
  selectedData: AdminAttendanceRecord;
  onApprove: (recordId: number, notes?: string) => Promise<void>;
  onDecline: (recordId: number, notes: string) => Promise<void>;
  closeModal: () => void;
}

const ApprovalModal: React.FC<ApprovalModalProps> = ({
  isOpen,
  selectedData,
  onApprove,
  onDecline,
  closeModal,
}) => {
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !selectedData) return null;

  const handleApprove = async () => {
    try {
      setLoading(true);
      setError(null);
      await onApprove(selectedData.id, notes || undefined);
      setNotes("");
      closeModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve attendance');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!notes.trim()) {
      setError('Notes are required when declining attendance');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await onDecline(selectedData.id, notes);
      setNotes("");
      closeModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to decline attendance');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setNotes("");
    setError(null);
    closeModal();
  };

  // Determine current approval status
  const isAlreadyProcessed = selectedData.approval_status !== 'pending' && selectedData.approval_status !== undefined;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white">
              <span className="text-xl font-semibold">{selectedData.name[0]}</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {isAlreadyProcessed ? 'Attendance Status' : 'Approve Attendance'}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {selectedData.name} - {selectedData.position}
              </p>
              <p className="text-xs text-gray-500">
                Date: {selectedData.date} • Clock In: {selectedData.clockIn} • Clock Out: {selectedData.clockOut}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-600 hover:text-gray-900 text-2xl font-bold"
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>

        {/* Show current status if already processed */}
        {isAlreadyProcessed && (
          <div className="mb-4 p-3 rounded-lg bg-gray-50">
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                selectedData.approval_status === 'approved' 
                  ? 'bg-green-200 text-green-700' 
                  : 'bg-red-200 text-red-700'
              }`}>
                {selectedData.approval_status === 'approved' ? 'Approved' : 'Declined'}
              </span>
              {selectedData.approved_at && (
                <span className="text-xs text-gray-500">
                  on {new Date(selectedData.approved_at).toLocaleDateString()}
                </span>
              )}
            </div>
            {selectedData.admin_notes && (
              <p className="text-sm text-gray-600">
                <strong>Admin Notes:</strong> {selectedData.admin_notes}
              </p>
            )}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Notes Input */}
        {!isAlreadyProcessed && (
          <div className="mb-6">
            <label htmlFor="admin-notes" className="block text-sm font-medium text-gray-700 mb-2">
              Admin Notes (Optional for approval, required for rejection)
            </label>
            <textarea
              id="admin-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about this attendance record..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              disabled={loading}
            />
          </div>
        )}

        {/* Action Buttons */}
        {!isAlreadyProcessed && (
          <div className="flex justify-center gap-4">
            <button
              onClick={handleReject}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold px-5 py-2 rounded-lg transition-all duration-300 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Decline'}
            </button>
            <button
              onClick={handleApprove}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold px-5 py-2 rounded-lg transition-all duration-300 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Approve'}
            </button>
          </div>
        )}

        {/* Close button for already processed records */}
        {isAlreadyProcessed && (
          <div className="flex justify-center">
            <button
              onClick={handleClose}
              className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-5 py-2 rounded-lg transition-all duration-300"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApprovalModal;
