'use client'

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';

interface MediaFileUploadProps {
  onUpload: (files: File[]) => void;
  prefix: string;
}

export function MediaFileUpload({ onUpload, prefix }: MediaFileUploadProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onUpload(acceptedFiles);
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer ${
        isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
      }`}
    >
      <input {...getInputProps()} />
      <Upload className="mx-auto h-12 w-12 text-gray-400" />
      {isDragActive ? (
        <p className="mt-2 text-blue-500">Drop the files here ...</p>
      ) : (
        <p className="mt-2 text-gray-500">Drag 'n' drop some files here, or click to select files</p>
      )}
      <p className="text-xs text-gray-400 mt-1">Uploading to: {prefix || 'Root'}</p>
    </div>
  );
}
