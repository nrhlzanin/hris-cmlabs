'use client';

import React, { useState } from 'react';
import { Letter } from '@/app/admin/letter/page';


interface LetterHistoryModalProps {
  letter: Letter;
  onClose: () => void;
  onApprove: (description?: string) => void;
  onDecline: (description?: string) => void;
  getStatusColor: (status: string) => string;
}

const LetterHistoryModal: React.FC<LetterHistoryModalProps> = ({ letter, onClose, onApprove, onDecline, getStatusColor }) => {
  const [description, setDescription] = useState('');

  const handleApprove = () => {
    onApprove(description);
  };

  const handleDecline = () => {
    onDecline(description);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-auto md:max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg sm:text-xl font-bold">Letter History - {letter.name}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">✕</button>
        </div>
        <div className="space-y-3 text-sm sm:text-base">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
            <div><span className="font-medium">Letter Name:</span> {letter.letterName}</div>
            <div><span className="font-medium">Type:</span> {letter.letterType}</div>
            <div><span className="font-medium">Valid Until:</span> {letter.validUntil}</div>
            <div>
              <span className="font-medium">Current Status:</span>
              <span className={`ml-2 px-2 py-1 text-xs rounded-full text-white ${getStatusColor(letter.status)}`}>
                {letter.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </span>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">History Timeline:</h3>
            <div className="space-y-2 max-h-48 sm:max-h-60 overflow-y-auto pr-2">
              {letter.history.length > 0 ? (
                letter.history.map((entry, index) => (
                  <div key={index} className="border-l-4 border-blue-200 pl-3 py-1 sm:pl-4 sm:py-2">
                    <div className="font-medium text-sm">{entry.status}</div>
                    <div className="text-xs text-gray-600">{entry.date}</div>
                    {entry.description && <div className="text-xs text-gray-800 mt-0.5 sm:text-sm">{entry.description}</div>}
                    {entry.actor && <div className="text-xs text-gray-500">by {entry.actor}</div>}
                  </div>
                ))
              ) : (
                <div className="text-gray-500 text-sm">No history available</div>
              )}
            </div>
          </div>

          {(letter.status === 'pending' || letter.status === 'waiting_reviewed') && (
            <div className="mt-4">
              <label htmlFor="action-description" className="block text-sm font-medium text-gray-700 mb-1">Add a description (optional):</label>
              <textarea
                id="action-description"
                rows={2}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full text-sm border border-gray-300 rounded-md p-2"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., Approved as per policy, Declined due to missing documents"
              ></textarea>
            </div>
          )}
        </div>
        <div className="flex justify-end mt-4 gap-2">
          <button onClick={onClose} className="px-3 py-1.5 bg-gray-500 text-white rounded-md hover:bg-gray-600 text-sm sm:px-4 sm:py-2">Close</button>
          {(letter.status === 'pending' || letter.status === 'waiting_reviewed') && (
            <>
              <button onClick={handleApprove} className="px-3 py-1.5 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm sm:px-4 sm:py-2">Approve</button>
              <button onClick={handleDecline} className="px-3 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm sm:px-4 sm:py-2">Decline</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LetterHistoryModal;