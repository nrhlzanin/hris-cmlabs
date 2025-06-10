'use client';
import React from 'react';

// Tipe untuk props komponen FormModal
interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FormModal: React.FC<FormModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Logika untuk mengirimkan data form akan ditambahkan di sini
    console.log("Form submitted!");
    onClose(); // Menutup modal setelah submit
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">Overtime Form</h2>
          <button onClick={onClose} aria-label="Close modal" className="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-red-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto pr-2">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input id="date" type="date" className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label htmlFor="end-time" className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
            <input id="end-time" type="time" className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload Supporting Evidence</label>
            <div className="mt-1 border-dashed border-2 border-gray-300 p-6 text-center rounded-lg hover:border-blue-500 transition-colors">
                <p className="text-gray-500 mb-2">Drag and Drop Here</p>
                <p className="text-sm text-gray-400">or</p>
                <input type="file" className="hidden" id="file-upload" />
                <label htmlFor="file-upload" className="font-semibold text-blue-600 cursor-pointer hover:underline">Browse Files</label>
            </div>
          </div>
          <div>
             <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
             <textarea id="description" placeholder="Enter details about the overtime work..." rows={3} className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
           </div>
          <div className="text-center pt-2">
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 w-full md:w-auto transition-colors shadow-sm">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormModal;

