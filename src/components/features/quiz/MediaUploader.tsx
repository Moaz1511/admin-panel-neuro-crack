'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { axiosInstance } from '@/lib/api/api-caller';
import { FolderSelector } from '@/components/ui/folder-selector';

interface MediaUploaderProps {
  mode: 'single' | 'bulk';
  onUploadSuccess: (urls: { name: string; link: string }[]) => void;
}

export function MediaUploader({ mode, onUploadSuccess }: MediaUploaderProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadPath, setUploadPath] = useState('uploads/');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('path', uploadPath); // Add the selected path

    const endpoint = mode === 'single' ? '/api/upload' : '/api/upload/bulk';
    
    if (mode === 'single') {
      formData.append('file', files[0]);
    } else {
      files.forEach(file => formData.append('files', file));
    }

    try {
      const response: any = await axiosInstance.post(endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      let uploadedData = [];
      if (mode === 'single') {
        uploadedData = [{ name: files[0].name, link: response.url }];
      } else {
        uploadedData = response.urls.map((url: string, index: number) => ({
          name: files[index].name,
          link: url,
        }));
      }

      onUploadSuccess(uploadedData);
      setFiles([]); // Clear files after successful upload
      // Reset input manually if needed or via key
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please check console.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4 border p-4 rounded-lg bg-gray-50/50">
      <h3 className="font-semibold text-md capitalize">{mode} Image Upload</h3>
      
      <FolderSelector onSelect={setUploadPath} defaultPath="uploads/" />

      <div>
        <label className="text-sm font-medium mb-1 block">Select File{mode === 'bulk' ? 's' : ''}</label>
        <Input 
          type="file" 
          multiple={mode === 'bulk'} 
          onChange={handleFileChange}
          // Simple reset strategy: key changes if needed, or controlled input
        />
      </div>

      <Button onClick={handleUpload} disabled={isUploading || files.length === 0} className="w-full">
        {isUploading ? 'Uploading...' : 'Upload'}
      </Button>
    </div>
  );
}
