// app/admin/components/letter/addletter.tsx

import React, { useState } from 'react';
import { ArrowUpTrayIcon, DocumentCheckIcon } from '@heroicons/react/24/outline';


type Props = {
  isOpen: boolean;
  onClose: () => void;
};

// Define a type for our form errors
type FormErrors = {
    employee?: string;
    letterType?: string;
    letterName?: string;
    validUntil?: string;
}

export default function AddLetter({ isOpen, onClose }: Props) {
  const [formData, setFormData] = useState({
    employee: '',
    letterType: '',
    letterName: '',
    validUntil: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  if (!isOpen) return null;

  const validate = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!formData.employee) newErrors.employee = 'Employee must be selected.';
    if (!formData.letterType) newErrors.letterType = 'Letter type must be selected.';
    if (!formData.letterName) newErrors.letterName = 'Letter name is required.';
    if (!formData.validUntil) newErrors.validUntil = 'Valid until date is required.';
    return newErrors;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
    } else {
        // Handle successful submission
        console.log('Form data:', { ...formData, file: selectedFile });
        setErrors({});
        onClose(); // Close modal on success
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
          setSelectedFile(e.target.files[0]);
      }
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6 pb-2 border-b">
          <h3 className="text-xl font-semibold">Add Letter</h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl font-bold">&times;</button>
        </div>
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Employee <span className="text-red-700">*</span></label>
                    <select name="employee" value={formData.employee} onChange={handleChange} className={`w-full border-gray-300 rounded-md shadow-sm ${errors.employee ? 'border-red-700' : ''}`}>
                        <option value="">- Choose Employee -</option>
                        <option value="Puma Pumi">Puma Pumi</option>
                    </select>
                    {errors.employee && <p className="text-red-700 text-xs mt-1">{errors.employee}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Letter Type <span className="text-red-700">*</span></label>
                    <select name="letterType" value={formData.letterType} onChange={handleChange} className={`w-full border-gray-300 rounded-md shadow-sm ${errors.letterType ? 'border-red-700' : ''}`}>
                        <option value="">- Choose Letter Type -</option>
                        <option value="Sakit">Sakit</option>
                    </select>
                     {errors.letterType && <p className="text-red-700 text-xs mt-1">{errors.letterType}</p>}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Letter Name <span className="text-red-700">*</span></label>
                <input type="text" name="letterName" value={formData.letterName} onChange={handleChange} className={`w-full border-gray-300 rounded-md shadow-sm ${errors.letterName ? 'border-red-700' : ''}`} placeholder="Enter letter name" />
                {errors.letterName && <p className="text-red-700 text-xs mt-1">{errors.letterName}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Letter Description</label>
                <textarea name="description" onChange={handleChange} className="w-full border-gray-300 rounded-md shadow-sm" placeholder="Enter letter description (optional)" rows={3}></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Upload Letter File</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                             {selectedFile ? (
                                <>
                                    <DocumentCheckIcon className="mx-auto h-12 w-12 text-green-700" />
                                    <p className="text-sm text-gray-900">{selectedFile.name}</p>
                                    <p className="text-xs text-gray-500">{(selectedFile.size / 1024).toFixed(2)} KB</p>
                                </>
                            ) : (
                                <>
                                    <ArrowUpTrayIcon className="mx-auto h-12 w-12 text-gray-400"/>
                                     <div className="flex text-sm text-gray-600">
                                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                                            <span>Upload a file</span>
                                            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} />
                                        </label>
                                    </div>
                                    <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Letter Status <span className="text-red-700">*</span></label>
                        <select name="status" onChange={handleChange} className="w-full border-gray-300 rounded-md shadow-sm">
                            <option>Active</option>
                            <option>Inactive</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Valid Until <span className="text-red-700">*</span></label>
                        <input type="date" name="validUntil" value={formData.validUntil} onChange={handleChange} className={`w-full border-gray-300 rounded-md shadow-sm ${errors.validUntil ? 'border-red-700' : ''}`} placeholder="dd/mm/yyyy" />
                        {errors.validUntil && <p className="text-red-700 text-xs mt-1">{errors.validUntil}</p>}
                    </div>
                </div>
            </div>

          <div className="flex justify-end pt-4">
            <button type="submit" className="bg-gray-800 text-white px-6 py-2 rounded-md hover:bg-gray-900 transition">Submit Letter</button>
          </div>
        </div>
      </form>
    </div>
  );
}
