import React from "react";

interface ApprovalModalProps {
  isOpen: boolean;
  selectedData: {
    id: number;
    name: string;
    position: string;
    clockIn: string;
    clockOut: string;
    workHours: string;
    approved: boolean | null;
  };
  handleApprove: () => void;
  handleReject: () => void;
  closeModal: () => void;
}

const ApprovalModal: React.FC<ApprovalModalProps> = ({
  isOpen,
  selectedData,
  handleApprove,
  handleReject,
  closeModal,
}) => {
  if (!isOpen || !selectedData) return null;

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
                Approve Attendance
              </h2>              <p className="text-sm text-gray-600 mt-2">
                Are you sure you want to approve {selectedData.name}&apos;s
                attendance? This action cannot be undone.
              </p>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="text-gray-600 hover:text-gray-900 text-2xl font-bold"
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>

        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={handleReject}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2 rounded-lg transition-all duration-300"
          >
            Reject
          </button>
          <button
            onClick={handleApprove}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded-lg transition-all duration-300"
          >
            Approve
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApprovalModal;
