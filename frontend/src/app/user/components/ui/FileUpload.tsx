'use client';

import React, { useCallback } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import { FaImage, FaFilePdf, FaFileWord } from 'react-icons/fa';

interface FileUploadProps {
  onFileAccepted: (file: File) => void;
  acceptedFileTypes?: { [key: string]: string[] };
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileAccepted, acceptedFileTypes }) => {
  const onDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[]) => {
    if (fileRejections.length > 0) {
      console.error('File ditolak:', fileRejections[0].errors[0].message);
      return;
    }
    if (acceptedFiles.length > 0) {
      onFileAccepted(acceptedFiles[0]);
    }
  }, [onFileAccepted]);

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop,
    accept: acceptedFileTypes,
    maxFiles: 1,
  });

  const selectedFile = acceptedFiles[0];
  const fileIcon = selectedFile ? (
    selectedFile.type.startsWith('image/') ? <FaImage className="w-8 h-8 text-blue-500" /> :
    selectedFile.type === 'application/pdf' ? <FaFilePdf className="w-8 h-8 text-red-500" /> :
    <FaFileWord className="w-8 h-8 text-blue-700" />
  ) : <FaImage className="w-10 h-10 text-gray-400" />;

  return (
    <div {...getRootProps()} className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}>
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center gap-2">
        <div className="mb-2">
          {fileIcon}
        </div>
        {selectedFile ? (
          <p className="text-sm text-gray-700 font-medium">{selectedFile.name}</p>
        ) : (
          isDragActive ?
            <p className="text-gray-600">Drop the file here ...</p> :
            <p className="text-gray-600">Drag and Drop Here <br/> Or <span className="font-semibold text-blue-600">Browse</span></p>
        )}
      </div>
    </div>
  );
};

export default FileUpload;