import React, { useState } from "react";
import { FaDownload, FaEye, FaEyeSlash, FaTimes } from "react-icons/fa";

interface DetailsModalProps {
  isOpen: boolean;
  selectedData: {
    id: number;
    name: string;
    position: string;
    clockIn: string;
    clockOut: string;
    workHours: string;
    approved: boolean | null;
    fileName?: string;
  };
  closeModal: () => void;
}

const DetailsModal: React.FC<DetailsModalProps> = ({
  isOpen,
  selectedData,
  closeModal,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  if (!isOpen || !selectedData) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-end">
      <div className="bg-white w-full sm:w-[450px] md:w-[500px] lg:w-[600px] max-w-full rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Attendance Details</h2>
          <button
            onClick={closeModal}
            className="text-gray-800 hover:text-black text-2xl font-bold"
            aria-label="Close modal"
          >
            <FaTimes />
          </button>
        </div>

        {/* Profile */}
        <div className="flex items-center gap-4 mb-4 border-b pb-4">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
            {selectedData.name.charAt(0)}
          </div>
          <div>
            <div className="font-semibold">{selectedData.name}</div>
            <div className="text-sm text-gray-800">{selectedData.position}</div>
          </div>
        </div>

        {/* Info */}
        <h3 className="font-semibold text-gray-900 mb-2">Attendance Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 border-b pb-4">
          <div>
            <p className="text-sm text-gray-800">Date</p>
            <p className="font-semibold text-gray-900">1 March 2025</p>
          </div>
          <div>
            <p className="text-sm text-gray-800">Check In</p>
            <p className="font-semibold text-gray-900">{selectedData.clockIn}</p>
          </div>
          <div>
            <p className="text-sm text-gray-800">Check Out</p>
            <p className="font-semibold text-gray-900">{selectedData.clockOut}</p>
          </div>
          <div>
            <p className="text-sm text-gray-800">Status</p>
            <p className="font-semibold text-gray-900">
              {selectedData.approved === null
                ? "Pending"
                : selectedData.approved
                  ? "Present"
                  : "Absent"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-800">Work Hours</p>
            <p className="font-semibold text-gray-900">{selectedData.workHours}</p>
          </div>
        </div>

        {/* Location */}
        <h3 className="font-semibold text-gray-900 mb-2">Location Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 border-b pb-4">
          <div>
            <p className="text-sm text-gray-800">Location Name</p>
            <p className="font-semibold text-gray-900">PT. Maju Jaya</p>
          </div>
          <div>
            <p className="text-gray-800">Detail Address</p>
            <p className="font-semibold text-gray-900">Jl. Raya No.123, Jakarta, Indonesia</p>
          </div>
          <div>
            <p className="text-gray-800">Latitude</p>
            <p className="font-semibold text-gray-900">-6.200000</p>
          </div>
          <div>
            <p className="text-gray-800">Longitude</p>
            <p className="font-semibold text-gray-900">106.816666</p>
          </div>
        </div>

        {/* Proof of Attendance */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">Proof of Attendance</h3>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">{selectedData.fileName}</span>
            <button onClick={toggleVisibility} className="text-gray-600 hover:text-gray-800 text-sm">
              {isVisible ? (
                <FaEyeSlash className="inline-block" />
              ) : (
                <FaEye className="inline-block" />
              )}
            </button>
            <button className="text-blue-600 hover:text-blue-800 text-sm">
              <FaDownload className="inline-block mr-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsModal;
