// components/admin/letter/viewhistory.tsx

'use client';
import React from 'react';
import { ClockIcon, CheckCircleIcon, XCircleIcon, HandThumbUpIcon, XMarkIcon, CheckIcon } from '@heroicons/react/24/solid';

// Impor tipe dari file types yang terpusat
import { Letter } from '../../../admin/letter/types';

// Props untuk komponen ViewHistory
type ViewHistoryProps = { 
    isOpen: boolean; 
    onClose: () => void; 
    letter: Letter; 
    onLetterUpdate: (updatedLetter: Letter) => void; 
};

// Fungsi bantuan untuk mendapatkan detail visual status
const getStatusDetails = (status: string) => {
  switch (status) {
    case 'Approved':
    case 'Accepted':
      return { bgColor: 'bg-green-100', textColor: 'text-green-800', iconColor: 'text-green-500', Icon: CheckCircleIcon };
    case 'Decline':
      return { bgColor: 'bg-red-100', textColor: 'text-red-800', iconColor: 'text-red-500', Icon: XCircleIcon };
    case 'Waiting Reviewed':
      return { bgColor: 'bg-yellow-100', textColor: 'text-yellow-800', iconColor: 'text-yellow-500', Icon: ClockIcon };
    case 'Done':
      return { bgColor: 'bg-blue-100', textColor: 'text-blue-800', iconColor: 'text-blue-500', Icon: HandThumbUpIcon };
    default:
      return { bgColor: 'bg-gray-100', textColor: 'text-gray-800', iconColor: 'text-gray-500', Icon: ClockIcon };
  }
};

export default function ViewHistory({ isOpen, onClose, letter, onLetterUpdate }: ViewHistoryProps) {
  if (!isOpen) return null;

  const handleAction = (historyIndex: number, action: 'Accepted' | 'Decline') => {
    // Memperbarui item riwayat yang dipilih
    const updatedHistory = letter.history.map((item, i) => 
        i === historyIndex ? { ...item, status: action, actor: "Processed by Admin" } : item
    );
    
    // Menentukan status utama baru untuk surat berdasarkan tindakan
    const newMainStatus: 'Approved' | 'Decline' = action === 'Accepted' ? 'Approved' : 'Decline';

    // Membuat objek surat baru dengan status dan riwayat yang diperbarui
    const updatedLetter: Letter = { 
        ...letter, 
        status: newMainStatus, 
        history: updatedHistory 
    };
    
    // Mengirim objek surat yang diperbarui kembali ke komponen induk
    onLetterUpdate(updatedLetter);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Submission History: {letter.name}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors rounded-full p-1" title="Close"><XMarkIcon className="h-6 w-6" /></button>
        </div>
        <div className="overflow-y-auto flex-grow pr-2">
          <ol className="relative border-l border-gray-200 ml-4">
            {letter.history.map((item, index) => {
              const { bgColor, textColor, iconColor, Icon } = getStatusDetails(item.status);
              const isActionable = item.status === 'Waiting Reviewed';
              return (
                <li key={index} className="mb-6 ml-8">
                  <span className={`absolute flex items-center justify-center w-8 h-8 ${bgColor} rounded-full -left-4 ring-8 ring-white`}><Icon className={`w-5 h-5 ${iconColor}`} /></span>
                  <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                    <div className="items-center justify-between sm:flex">
                        <div className="mb-2 sm:mb-0">
                            <time className="text-sm font-semibold text-gray-700">{item.date}</time>
                            <div className="text-sm font-normal text-gray-500">{item.actor || 'System'}</div>
                        </div>
                        <div className={`text-sm font-semibold ${textColor} px-3 py-1 rounded-full ${bgColor}`}>{item.status}</div>
                    </div>
                    {item.description && <p className="mt-3 text-sm font-normal text-gray-600 p-3 bg-gray-50 rounded-md">{item.description}</p>}
                    {isActionable && (
                        <div className="flex gap-3 mt-4 pt-3 border-t border-gray-200">
                           <button onClick={() => handleAction(index, 'Accepted')} className="inline-flex items-center px-4 py-2 text-sm font-medium text-green-700 bg-green-100 border border-transparent rounded-lg hover:bg-green-200 transition-all" title="Approve"><CheckIcon className="h-5 w-5 mr-2" />Approve</button>
                           <button onClick={() => handleAction(index, 'Decline')} className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-700 bg-red-100 border border-transparent rounded-lg hover:bg-red-200 transition-all" title="Decline"><XMarkIcon className="h-5 w-5 mr-2" />Decline</button>
                        </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </div>
  );
}
