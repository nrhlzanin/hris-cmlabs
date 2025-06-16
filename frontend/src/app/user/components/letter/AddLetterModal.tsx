'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { X, UploadCloud } from 'lucide-react';

export interface LetterFormData {
  letterType: string;
  letterName: string;
  letterDescription: string;
  validUntil: string;
  file: File | null;
}

interface AddLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: LetterFormData) => Promise<void>;
}

const AddLetterModal: React.FC<AddLetterModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<LetterFormData>({
    letterType: '',
    letterName: '',
    letterDescription: '',
    validUntil: '',
    file: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      handleInputChange('file', acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: { 'application/pdf': ['.pdf'], 'image/*': ['.jpeg', '.jpg', '.png'] },
  });

  const handleInputChange = (field: keyof LetterFormData, value: string | File) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.letterType || !formData.letterName || !formData.validUntil) {
      alert('Please fill all required fields (*)');
      return;
    }
    setIsSubmitting(true);
    await onSubmit(formData);
    setIsSubmitting(false);
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-lg w-full max-w-lg shadow-xl max-h-[90vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center flex-shrink-0">
          <h3 className="text-lg font-semibold text-gray-900">Add New Letter</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Letter Type <span className="text-red-500">*</span></label>
            <select
              value={formData.letterType}
              onChange={(e) => handleInputChange('letterType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" required>
              <option value="">Choose Letter Type</option>
              <option value="Absence">Absence</option>
              <option value="Annual Leave">Annual Leave</option>
              <option value="Sick Leave">Sick Leave</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Letter Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={formData.letterName}
              onChange={(e) => handleInputChange('letterName', e.target.value)}
              placeholder="e.g., Surat Izin Sakit"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Valid Until <span className="text-red-500">*</span></label>
            <input
              type="date"
              value={formData.validUntil}
              onChange={(e) => handleInputChange('validUntil', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.letterDescription}
              onChange={(e) => handleInputChange('letterDescription', e.target.value)}
              rows={3}
              placeholder="Enter brief description (optional)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload File</label>
            {/* PENERAPAN ASPECT RATIO */}
            <div {...getRootProps()} className={`relative border-2 border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer transition-colors aspect-video flex flex-col justify-center items-center ${isDragActive ? 'bg-blue-50 border-blue-400' : 'hover:bg-gray-50'}`}>
              <input {...getInputProps()} />
              <UploadCloud className="h-10 w-10 text-gray-400 mb-2" />
              {formData.file ? (
                <p className="text-sm text-gray-800 font-medium">{formData.file.name}</p>
              ) : (
                <p className="text-sm text-gray-500">Drag & drop files here, or click to select files</p>
              )}
            </div>
          </div>
        </form>

        <div className="p-4 border-t flex justify-end gap-3 flex-shrink-0">
          <button type="button" onClick={onClose} disabled={isSubmitting} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 disabled:opacity-50">Cancel</button>
          <button type="submit" onClick={handleSubmit} disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:opacity-50">
            {isSubmitting ? 'Submitting...' : 'Submit Letter'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddLetterModal;