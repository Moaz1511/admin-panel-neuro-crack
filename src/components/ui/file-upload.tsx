'use client'

import { useState } from 'react';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface FileUploadProps {
  onUpload: (filePath: string) => void;
}

export function FileUpload({ onUpload }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:9000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      onUpload(response.data.filePath);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <Input type="file" onChange={handleFileChange} />
      <Button type="button" onClick={handleUpload}>Upload</Button>
    </div>
  );
}
