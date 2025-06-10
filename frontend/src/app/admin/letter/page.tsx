'use client';
import React, { useState } from 'react';
import {
  PlusIcon,
  DocumentTextIcon,
  EyeIcon
} from '@heroicons/react/24/solid';

import { Letter, LetterType } from './types';
import AddLetter from '../../components/admin/letter/addletter';
import AddLetterType from '../../components/admin/letter/addlettertype';
import ViewLetter from '../../components/admin/letter/viewletter';
import ViewHistory from '../../components/admin/letter/viewhistory';

const initialLetters: Letter[] = [
  {
    id: 1,
    name: 'Puma Pumi',
    letterName: 'Surat Sakit',
    letterType: 'Absensi',
    validUntil: '17 March 2023',
    status: 'Waiting Reviewed',
    history: [
      { date: 'August, 15 2025', status: 'Waiting Reviewed', description: 'Sakit Hati Pak' },
      { date: 'August, 10 2025', status: 'Done', description: '' },
      { date: 'August, 05 2025', status: 'Decline', description: '' },
      { date: 'July, 19 2025', status: 'Accepted', description: '' },
    ],
  },
  {
    id: 2,
    name: 'Dika Dikut',
    letterName: 'Surat Sakit',
    letterType: 'Absensi',
    validUntil: '17 March 2023',
    status: 'Approved',
    history: [],
  },
  {
    id: 3,
    name: 'Anin Pulu-Pulu',
    letterName: 'Surat Sakit',
    letterType: 'Absensi',
    validUntil: '17 March 2023',
    status: 'Decline',
    history: [],
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Approved': return 'bg-green-600';
    case 'Decline': return 'bg-red-600';
    case 'Waiting Reviewed': return 'bg-yellow-600';
    default: return 'bg-gray-500';
  }
};

export default function LettersOverview() {
  const [letters, setLetters] = useState<Letter[]>(initialLetters);
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showLetterModal, setShowLetterModal] = useState(false);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [showTypeOverviewModal, setShowTypeOverviewModal] = useState(false);
  const [editingType, setEditingType] = useState<LetterType | null>(null);

  const filteredLetters = letters.filter((letter) =>
    letter.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditType = (type: LetterType) => {
    setEditingType(type);
    setShowTypeOverviewModal(false);
    setShowTypeModal(true);
  };

  const handleAddNewType = () => {
    setEditingType(null);
    setShowTypeModal(true);
  };

  const handleCloseTypeModal = () => {
    setShowTypeModal(false);
    setEditingType(null);
  };

  const handleViewHistory = (letter: Letter) => {
    setSelectedLetter(letter);
    setIsHistoryOpen(true);
  };

  const handleUpdateLetter = (updated: Letter) => {
    const updatedLetters = letters.map((lt) =>
      lt.id === updated.id ? updated : lt
    );
    setLetters(updatedLetters);
    setIsHistoryOpen(false);
    setSelectedLetter(null);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md p-6">
          {/* HEADER */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h1 className="text-2xl font-bold text-gray-800">Letters Overview</h1>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search Employee..."
                className="w-full sm:w-auto border border-gray-300 rounded-lg shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg shadow-md flex items-center justify-center gap-2 text-sm"
                onClick={() => setShowLetterModal(true)}
              >
                <PlusIcon className="h-5 w-5" />
                <span>Add Letter</span>
              </button>
              <button
                className="w-full sm:w-auto bg-gray-700 hover:bg-gray-800 text-white px-3 py-2 rounded-lg shadow-md flex items-center justify-center gap-2 text-sm"
                onClick={handleAddNewType}
              >
                <PlusIcon className="h-5 w-5" />
                <span>Add Type</span>
              </button>
              <button
                className="w-full sm:w-auto bg-gray-700 hover:bg-gray-800 text-white px-3 py-2 rounded-lg shadow-md flex items-center justify-center gap-2 text-sm"
                onClick={() => setShowTypeOverviewModal(true)}
              >
                <DocumentTextIcon className="h-5 w-5" />
                <span>View Types</span>
              </button>
            </div>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="min-w-[600px] w-full bg-white">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Employee Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Letter Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Letter Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Valid Until</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredLetters.map((letter) => (
                  <tr key={letter.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap flex items-center gap-3">
                      <img className="h-8 w-8 rounded-full" src={`https://i.pravatar.cc/40?u=${letter.id}`} alt="" />
                      <span className="text-sm font-medium text-gray-900">{letter.name}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{letter.letterName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{letter.letterType}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{letter.validUntil}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full text-white ${getStatusColor(letter.status)}`}>
                        {letter.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleViewHistory(letter)}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-gray-200"
                        title="View History"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODALS */}
      <AddLetter isOpen={showLetterModal} onClose={() => setShowLetterModal(false)} />
      <AddLetterType isOpen={showTypeModal} onClose={handleCloseTypeModal} initialData={editingType} />
      <ViewLetter isOpen={showTypeOverviewModal} onClose={() => setShowTypeOverviewModal(false)} onEdit={handleEditType} />
      {selectedLetter && (
        <ViewHistory
          isOpen={isHistoryOpen}
          onClose={() => {
            setIsHistoryOpen(false);
            setSelectedLetter(null);
          }}
          letter={selectedLetter}
          onLetterUpdate={handleUpdateLetter}
        />
      )}
    </>
  );
}
