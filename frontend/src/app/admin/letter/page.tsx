'use client';
import React, { useState } from 'react';
import { formatJakartaDate } from '@/lib/timezone';

// Define the letter type
type Letter = {
  id: number;
  name: string;
  letterName: string;
  letterType: string;
  validUntil: string;
  status: string;
  history: Array<{
    date: string;
    status: string;
    description: string;
  }>;
};

// Updated letters data with Jakarta timezone formatting
const lettersData: Letter[] = [
  {
    id: 1,
    name: 'Puma Pumi',
    letterName: 'Surat Sakit',
    letterType: 'Absensi',
    validUntil: formatJakartaDate(new Date('2023-03-17'), {
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    }) + ' WIB',
    status: 'Waiting Reviewed',
    history: [
      { date: formatJakartaDate(new Date('2025-08-15'), { year: 'numeric', month: 'long', day: 'numeric' }) + ' WIB', status: 'Waiting Reviewed', description: 'Sakit Hati Pak' },
      { date: formatJakartaDate(new Date('2025-08-10'), { year: 'numeric', month: 'long', day: 'numeric' }) + ' WIB', status: 'Done', description: '' },
      { date: formatJakartaDate(new Date('2025-08-05'), { year: 'numeric', month: 'long', day: 'numeric' }) + ' WIB', status: 'Decline', description: '' },
      { date: formatJakartaDate(new Date('2025-07-19'), { year: 'numeric', month: 'long', day: 'numeric' }) + ' WIB', status: 'Accepted', description: '' },
      { date: formatJakartaDate(new Date('2025-06-20'), { year: 'numeric', month: 'long', day: 'numeric' }) + ' WIB', status: '', description: '' },
      { date: formatJakartaDate(new Date('2024-09-30'), { year: 'numeric', month: 'long', day: 'numeric' }) + ' WIB', status: '', description: '' },
    ],
  },
  {
    id: 2,
    name: 'Dika Dikut',
    letterName: 'Surat Sakit',
    letterType: 'Absensi',
    validUntil: formatJakartaDate(new Date('2023-03-17'), {
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    }) + ' WIB',
    status: 'Approved',
    history: [],
  },
  {
    id: 3,
    name: 'Anin Pulu-Pulu',
    letterName: 'Surat Sakit',
    letterType: 'Absensi',
    validUntil: formatJakartaDate(new Date('2023-03-17'), {
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    }) + ' WIB',
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
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null);
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
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md p-6">
        {/* HEADER */}
        <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
          <h1 className="text-xl font-bold">Letters Overview</h1>
          <div className="text-sm text-gray-600">
            All dates shown in Jakarta timezone (WIB)
          </div>
          <div className="flex gap-2 flex-wrap">
            <input
              type="text"
              placeholder="Search Employee"
              className="border rounded px-2 py-1"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="bg-blue-500 text-white px-4 py-2 rounded text-sm" onClick={() => setShowLetterModal(true)}>
              ➕ Add Letter
            </button>
            <button className="bg-gray-300 text-black px-4 py-2 rounded text-sm" onClick={() => setShowTypeModal(true)}>
              ➕ Add Letter Type
            </button>
            <button className="bg-gray-300 text-black px-4 py-2 rounded text-sm" onClick={() => setShowTypeOverviewModal(true)}>
              📄 View Letter Types
            </button>
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
                ))
              ) : (
                <tr>
                  <td className="px-4 py-4 text-center text-gray-500" colSpan={6}>No matching data found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
          <div>
            Showing <strong>1 to 10</strong> out of <strong>60</strong> records
          </div>
          <div className="flex items-center gap-2">
            <button className="px-2 py-1 border rounded disabled:opacity-50" disabled>{'<'}</button>
            <button className="px-3 py-1 bg-blue-500 text-white rounded">1</button>
            <button className="px-3 py-1 border rounded">2</button>
            <button className="px-3 py-1 border rounded">3</button>
            <button className="px-2 py-1 border rounded">{'>'}</button>
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
