'use client';

import { useState } from 'react';

const lettersData = [
  {
    id: 1,
    name: 'Puma Pumil',
    letterName: 'Surat Sakit',
    letterType: 'Absensi',
    validUntil: 'August 15, 2025',
    status: 'Waiting Reviewed',
    description: 'Sakit Hati Pak',
    history: [
      {
        date: 'August 15, 2025',
        status: 'Waiting Reviewed',
        description: 'Sakit Hati Pak',
      },
      {
        date: 'August 10, 2025',
        status: 'Done',
      },
      {
        date: 'August 05, 2025',
        status: 'Decline',
      },
      {
        date: 'July 19, 2025',
        status: 'Accepted',
      },
      {
        date: 'June 20, 2025',
        status: '',
      },
      {
        date: 'September 30, 2024',
        status: '',
      },
    ],
  },
  {
    id: 2,
    name: 'Dika Dikut',
    letterName: 'Surat Sakit',
    letterType: 'Absensi',
    validUntil: 'March 17, 2023',
    status: 'Approved',
    history: [
      {
        date: 'March 17, 2023',
        status: 'Approved',
        description: 'Demam dan flu',
      },
    ],
  },
  {
    id: 3,
    name: 'Anin Pulu-Pulu',
    letterName: 'Surat Sakit',
    letterType: 'Absensi',
    validUntil: 'March 17, 2023',
    status: 'Decline',
    history: [
      {
        date: 'March 17, 2023',
        status: 'Decline',
        description: 'Terlambat mengajukan surat',
      },
    ],
  },
];

export default function LettersOverview() {
  const [search, setSearch] = useState('');
  const [selectedLetter, setSelectedLetter] = useState(null);

  const filteredLetters = lettersData.filter((letter) =>
    letter.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow max-w-6xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h1 className="text-xl font-semibold whitespace-nowrap">
            Letters Overview
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              placeholder="Search Employee"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 w-48"
            />
            <button className="border border-gray-300 rounded px-4 py-2 text-sm hover:bg-gray-100">
              Add Letter Type
            </button>
            <button className="border border-gray-300 rounded px-4 py-2 text-sm hover:bg-gray-100">
              Letter Type Overview
            </button>
            <button className="bg-blue-600 text-white rounded px-4 py-2 text-sm hover:bg-blue-700">
              Add Letter
            </button>
          </div>
        </div>

        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">Employee Name</th>
              <th className="px-4 py-2">Letter Name</th>
              <th className="px-4 py-2">Letter Type</th>
              <th className="px-4 py-2">Valid Until</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredLetters.map((letter) => (
              <tr key={letter.id}>
                <td className="px-4 py-2 flex items-center gap-2">
                  <span className="h-6 w-6 rounded-full bg-gray-300"></span>
                  {letter.name}
                </td>
                <td className="px-4 py-2">{letter.letterName}</td>
                <td className="px-4 py-2">{letter.letterType}</td>
                <td className="px-4 py-2">{letter.validUntil}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium text-white ${
                      letter.status === 'Approved'
                        ? 'bg-green-600'
                        : letter.status === 'Decline'
                        ? 'bg-red-600'
                        : 'bg-yellow-500'
                    }`}
                  >
                    {letter.status}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => setSelectedLetter(letter)}
                    className="bg-blue-900 text-white px-3 py-1 rounded text-xs hover:bg-blue-950"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <span>Showing</span>
            <button className="border px-3 py-1 rounded text-sm">10</button>
          </div>
          <span>Showing 1 to 10 out of 60 records</span>
          <div className="flex items-center gap-1">
            <button className="text-gray-500 px-3 py-1 rounded" disabled>
              &lt;
            </button>
            <button className="bg-gray-200 text-black px-3 py-1 rounded">2</button>
            <button className="text-gray-500 px-3 py-1 rounded">&gt;</button>
          </div>
        </div>
      </div>

      {/* Modal with Letter Detail & History */}
      {selectedLetter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xl max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Letter Details</h2>
              <button
                onClick={() => setSelectedLetter(null)}
                className="text-gray-600 hover:text-black text-2xl font-bold"
              >
                &times;
              </button>
            </div>
            <div className="space-y-2">
              <p><strong>Name:</strong> {selectedLetter.name}</p>
              <p><strong>Letter Name:</strong> {selectedLetter.letterName}</p>
              <p><strong>Letter Type:</strong> {selectedLetter.letterType}</p>
              <p><strong>Valid Until:</strong> {selectedLetter.validUntil}</p>
              <p><strong>Status:</strong> {selectedLetter.status}</p>
              {selectedLetter.description && (
                <p><strong>Description:</strong> {selectedLetter.description}</p>
              )}
            </div>

            {/* History Table */}
            {selectedLetter.history && (
              <div className="mt-6">
                <h3 className="font-semibold mb-2">Submission History</h3>
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
                        <td className="px-2 py-1 border">
                          {item.description || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
