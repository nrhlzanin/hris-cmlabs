// app/admin/components/letter/addlettertype.tsx

import React, { useState, useEffect } from 'react';
import { LetterType } from '../../../admin/letter/types';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  initialData?: LetterType | null;
};

type FormErrors = {
    letterTypeName?: string;
}

export default function AddLetterType({ isOpen, onClose, initialData }: Props) {
    const isEditing = !!initialData;
    const [formData, setFormData] = useState({
        letterTypeName: '',
        content: ''
    });
    const [errors, setErrors] = useState<FormErrors>({});

    useEffect(() => {
        if (isOpen) {
            if (isEditing) {
                setFormData({
                    letterTypeName: initialData.name,
                    content: initialData.content
                });
            } else {
                 setFormData({ letterTypeName: '', content: '' });
            }
            setErrors({}); // Clear errors when modal opens or data changes
        }
    }, [isOpen, initialData, isEditing]);


    if (!isOpen) return null;

    const validate = (): FormErrors => {
        const newErrors: FormErrors = {};
        if (!formData.letterTypeName.trim()) {
            newErrors.letterTypeName = 'Letter type name is required.';
        }
        return newErrors;
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        } else {
            console.log('Form data:', formData);
            setErrors({});
            onClose(); // Close modal on success
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 max-w-lg w-full">
                <div className="flex justify-between items-center mb-6 pb-2 border-b">
                    <h3 className="text-xl font-semibold">{isEditing ? 'Edit' : 'Add'} Letter Type</h3>
                    <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl font-bold">&times;</button>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Letter Type Name <span className="text-red-500">*</span></label>
                        <input 
                            type="text"
                            name="letterTypeName"
                            value={formData.letterTypeName}
                            onChange={handleChange}
                            placeholder="Enter Letter Type Name"
                            className={`w-full border-gray-300 rounded-md shadow-sm ${errors.letterTypeName ? 'border-red-500' : ''}`}
                        />
                        {errors.letterTypeName && <p className="text-red-500 text-xs mt-1">{errors.letterTypeName}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            placeholder="Enter Content For The Letter Type"
                            className="w-full border-gray-300 rounded-md shadow-sm"
                            rows={3}
                        ></textarea>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button type="submit" className="bg-gray-800 text-white px-6 py-2 rounded-md hover:bg-gray-900 transition">Submit</button>
                    </div>
                </div>
            </form>
        </div>
    );
}
