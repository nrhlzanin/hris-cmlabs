'use client';
import React, { useState } from 'react';

const lettersData = [
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
      { date: 'June, 20 2025', status: '', description: '' },
      { date: 'September, 30 2024', status: '', description: '' },
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

export default function LettersOverview() {
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showLetterModal, setShowLetterModal] = useState(false);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [showTypeOverviewModal, setShowTypeOverviewModal] = useState(false);

  const filteredLetters = lettersData.filter((letter) =>
    letter.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md p-6">
        {/* HEADER */}
        <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
          <h1 className="text-xl font-bold">Letters Overview</h1>
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
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 text-left">Employee Name</th>
                <th className="px-4 py-2 text-left">Letter Name</th>
                <th className="px-4 py-2 text-left">Letter Type</th>
                <th className="px-4 py-2 text-left">Valid Until</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredLetters.length > 0 ? (
                filteredLetters.map((letter) => (
                  <tr key={letter.id}>
                    <td className="px-4 py-2 flex items-center gap-2">
                      <span className="h-6 w-6 rounded-full bg-gray-300"></span>
                      {letter.name}
                    </td>
                    <td className="px-4 py-2">{letter.letterName}</td>
                    <td className="px-4 py-2">{letter.letterType}</td>
                    <td className="px-4 py-2">{letter.validUntil}</td>
                    <td className="px-4 py-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${
                        letter.status === 'Approved'
                          ? 'bg-green-600'
                          : letter.status === 'Decline'
                          ? 'bg-red-600'
                          : 'bg-yellow-500'
                      }`}>
                        {letter.status}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => setSelectedLetter(letter)}
                        className="bg-blue-900 text-white px-3 py-1 rounded text-xs hover:bg-blue-950"
                      >
                        👁️ View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-4 py-4 text-center text-gray-500" colSpan="6">No matching data found.</td>
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

        {/* Modal Add Letter */}
        {showLetterModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 max-w-lg w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Add Letter</h3>
                <button onClick={() => setShowLetterModal(false)} className="text-gray-600 text-2xl font-bold">&times;</button>
              </div>
              <div className="space-y-2">
                <select className="w-full border p-2 rounded">
                  <option>- Choose Employee -</option>
                </select>
                <select className="w-full border p-2 rounded">
                  <option>- Choose Letter Type -</option>
                </select>
                <input type="text" className="w-full border p-2 rounded" placeholder="Enter Letter Name" />
                <input type="text" className="w-full border p-2 rounded" placeholder="Enter Letter Description (optional)" />
                <input type="file" className="w-full border p-2 rounded" />
                <select className="w-full border p-2 rounded">
                  <option>Active</option>
                </select>
                <input type="date" className="w-full border p-2 rounded" />
                <button className="bg-blue-600 text-white px-4 py-2 rounded">Submit Letter</button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Add Letter Type */}
        {showTypeModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 max-w-lg w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Add Letter Type</h3>
                <button onClick={() => setShowTypeModal(false)} className="text-gray-600 text-2xl font-bold">&times;</button>
              </div>
              <div className="space-y-2">
                <input type="text" placeholder="Enter Letter Type Name" className="w-full border p-2 rounded" />
                <input type="text" placeholder="Enter Content For The Letter Type" className="w-full border p-2 rounded" />
                <button className="bg-blue-600 text-white px-4 py-2 rounded">Submit</button>
              </div>
            </div>
          </div>
        )}

        {/* Modal View Letter Types */}
        {showTypeOverviewModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 max-w-xl w-full max-h-[90vh] overflow-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Letter Type</h3>
                <button onClick={() => setShowTypeOverviewModal(false)} className="text-gray-600 text-2xl font-bold">&times;</button>
              </div>
              <table className="w-full border text-sm">
                <thead className="bg-gray-100">
                  <tr><th className="border p-2">Letter Type Name</th><th className="border p-2">Contents</th><th className="border p-2">Action</th></tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border p-2">Sakit</td>
                    <td className="border p-2">Digunakan ketika seseorang sakit</td>
                    <td className="border p-2 space-x-2"><button>✏️</button><button>🗑️</button></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal View History */}
        {selectedLetter && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xl max-h-[90vh] overflow-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Submission History</h2>
                <button onClick={() => setSelectedLetter(null)} className="text-gray-600 hover:text-black text-2xl font-bold">
                  &times;
                </button>
              </div>
              <table className="min-w-full text-sm text-left border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-2 py-1 border">No</th>
                    <th className="px-2 py-1 border">Date</th>
                    <th className="px-2 py-1 border">Action</th>
                    <th className="px-2 py-1 border">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedLetter.history.map((item, index) => (
                    <tr key={index}>
                      <td className="px-2 py-1 border">{index + 1}</td>
                      <td className="px-2 py-1 border">{item.date}</td>
                      <td className="px-2 py-1 border">
                        {item.status === 'Waiting Reviewed' ? (
                          <div className="flex gap-1">
                            <span className="text-green-600">✔️</span>
                            <span className="text-red-600">❌</span>
                          </div>
                        ) : item.status === 'Done' ? (
                          <span className="bg-yellow-500 text-white px-2 py-0.5 rounded">Done</span>
                        ) : item.status === 'Decline' ? (
                          <span className="bg-red-600 text-white px-2 py-0.5 rounded">Decline</span>
                        ) : item.status === 'Accepted' ? (
                          <span className="bg-green-600 text-white px-2 py-0.5 rounded">Accepted</span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-2 py-1 border">{item.description || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
