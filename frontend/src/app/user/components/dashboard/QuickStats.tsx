import React from 'react';
import { CheckCircle, Clock, FileText, XCircle, AlertTriangle, X } from 'lucide-react';

interface WarningModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    children: React.ReactNode;
}

const WarningModal: React.FC<WarningModalProps> = ({ isOpen, onClose, onConfirm, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="p-4 border-b flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="text-yellow-500" />
                        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>
                </div>
                <div className="p-6">
                    <p className="text-sm text-gray-600">{children}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-b-lg flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 text-sm font-medium">
                        Cancel
                    </button>
                    <button onClick={onConfirm} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium">
                        Go to Check In
                    </button>
                </div>
            </div>
        </div>
    );
};

interface QuickStatsProps {
    isCheckedIn: boolean;
    checkInTime: string | null;
    onStatusClick: () => void;
    isModalOpen: boolean;
    onModalClose: () => void;
    onModalConfirm: () => void;
}

const QuickStats: React.FC<QuickStatsProps> = ({
    isCheckedIn,
    checkInTime,
    onStatusClick,
    isModalOpen,
    onModalClose,
    onModalConfirm
}) => {
    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {isCheckedIn ? (
                    <div className="bg-white rounded-lg shadow-sm border p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Today&apos;s Status</p>
                                <p className="text-lg font-bold text-green-600">Checked In</p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-lg">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">{checkInTime}</p>
                    </div>
                ) : (
                    <div
                        onClick={onStatusClick}
                        className="bg-white rounded-lg shadow-sm border border-red-200 p-4 cursor-pointer hover:bg-red-50 transition-colors"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Today&apos;s Status</p>
                                <p className="text-lg font-bold text-red-600">Not Checked In</p>
                            </div>
                            <div className="p-3 bg-red-100 rounded-lg">
                                <XCircle className="h-5 w-5 text-red-600" />
                            </div>
                        </div>
                        <p className="text-xs text-red-500 mt-2">Click here to check in</p>
                    </div>
                )}


                <div className="bg-white rounded-lg shadow-sm border p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Hours Today</p>
                            <p className="text-lg font-bold text-blue-600">6h 45m</p>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <Clock className="h-5 w-5 text-blue-600" />
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Target: 8 hours</p>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Pending</p>
                            <p className="text-lg font-bold text-orange-600">2</p>
                        </div>
                        <div className="p-3 bg-orange-100 rounded-lg">
                            <FileText className="h-5 w-5 text-orange-600" />
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">1 leave, 1 overtime</p>
                </div>
            </div>

            <WarningModal
                isOpen={isModalOpen}
                onClose={onModalClose}
                onConfirm={onModalConfirm}
                title="Check In Required"
            >
                You have not checked in today. Please go to the Check In page to record your attendance.
            </WarningModal>
        </>
    );
};

export default QuickStats;