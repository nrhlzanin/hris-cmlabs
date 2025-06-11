'use client';
import React from 'react';
import { Employee, Detail } from '@/app/admin/overtime/types';

// Tipe untuk props komponen DetailModal
interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: Detail[];
  employee: Employee | null;
}

const DetailModal: React.FC<DetailModalProps> = ({ isOpen, onClose, data, employee }) => {
  if (!isOpen || !employee) return null;

  return (
    // Backdrop overlay
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      {/* Konten Modal */}
      <div 
        className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col transform transition-all duration-300 ease-in-out" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal */}
        <div className="flex justify-between items-center p-4 md:p-5 border-b border-gray-200 flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Overtime History</h2>
            <p className="text-sm text-gray-500">for <span className="font-semibold text-blue-600">{employee.name}</span></p>
          </div>
          <button 
            onClick={onClose} 
            aria-label="Close modal" 
            className="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-red-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body Modal (Scrollable) */}
        <div className="overflow-y-auto p-4 md:p-5">
           {/* Tampilan tabel untuk desktop */}
           <table className="hidden md:table min-w-full w-full table-auto text-sm">
             <thead className="bg-slate-50 text-slate-700">
               <tr>
                 <th className="px-4 py-3 text-center w-16 font-semibold rounded-tl-lg">No</th>
                 <th className="px-4 py-3 text-left font-semibold">Date</th>
                 <th className="px-4 py-3 text-center font-semibold">Action</th>
                 <th className="px-4 py-3 text-left font-semibold rounded-tr-lg">Detail</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-gray-200">
               {data.map((item) => (
                 <tr key={item.no} className="hover:bg-slate-50 transition-colors">
                   <td className="px-4 py-3 text-center text-gray-600">{item.no}</td>
                   <td className="px-4 py-3 font-medium text-gray-800">{item.date}</td>
                   <td className="px-4 py-3 text-center">{item.action || <span className="text-gray-400 italic">No Action</span>}</td>
                   <td className="px-4 py-3 text-gray-600">{item.detail || "-"}</td>
                 </tr>
               ))}
             </tbody>
           </table>

           {/* Tampilan kartu untuk mobile */}
           <div className="md:hidden space-y-4">
             {data.map(item => (
               <div key={item.no} className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
                 <div className="flex justify-between items-start mb-3">
                   <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">NO: {item.no}</span>
                   <span className="text-sm font-medium text-gray-500">{item.date}</span>
                 </div>
                 {item.detail && (
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-md mb-3">{item.detail}</p>
                 )}
                 <div className="pt-3 border-t border-gray-200 flex justify-center items-center">
                    {item.action || <span className="text-gray-400 italic">No Action</span>}
                 </div>
               </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;
