// app/admin/components/letter/viewletter.tsx

import React from 'react';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/solid';
import { LetterType } from '../../../admin/letter/types';

const mockLetterTypes: LetterType[] = [
    { id: 1, name: 'Sakit', content: 'Digunakan ketika seseorang sakit' },
    { id: 2, name: 'Izin', content: 'Digunakan untuk keperluan mendesak' },
];

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (type: LetterType) => void;
};

export default function ViewLetter({ isOpen, onClose, onEdit }: Props) {
    if (!isOpen) return null;
    
    const handleEditClick = (type: LetterType) => {
        // This check prevents the "onEdit is not a function" runtime error.
        if (typeof onEdit === 'function') {
            onEdit(type);
        } else {
            console.error("onEdit prop is not a function. Received:", onEdit);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Letter Types</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl font-bold">&times;</button>
                </div>
                <table className="w-full border text-sm">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="p-2 border text-left text-gray-600">Letter Type Name</th>
                            <th className="p-2 border text-left text-gray-600">Contents</th>
                            <th className="p-2 border text-left text-gray-600">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {mockLetterTypes.map((type) => (
                             <tr key={type.id}>
                                <td className="p-2 border">{type.name}</td>
                                <td className="p-2 border">{type.content}</td>
                                <td className="p-2 border space-x-2">
                                    <button onClick={() => handleEditClick(type)} className="p-1 text-blue-600 hover:text-blue-800"><PencilSquareIcon className="w-4 h-4" /></button>
                                    <button className="p-1 text-red-600 hover:text-red-800"><TrashIcon className="w-4 h-4" /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
