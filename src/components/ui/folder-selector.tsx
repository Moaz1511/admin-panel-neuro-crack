'use client';

import { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { axiosInstance } from '@/lib/api/api-caller';
import { ApiEndpoints } from '@/lib/api/api-endpoints';

interface FolderSelectorProps {
  onSelect: (path: string) => void;
  defaultPath?: string;
  label?: string;
}

export function FolderSelector({ onSelect, defaultPath = 'uploads/', label = 'Select Destination Folder' }: FolderSelectorProps) {
  const [folders, setFolders] = useState<{ name: string }[]>([]);
  const [selectedFolder, setSelectedFolder] = useState(defaultPath);

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const response: any = await axiosInstance.get(`${ApiEndpoints.mediaManager.files}?recursive=true&sortBy=name&order=asc`);
        if (response && response.folders) {
          setFolders(response.folders);
        }
      } catch (error) {
        console.error('Error fetching folders:', error);
      }
    };
    fetchFolders();
  }, []);

  const handleValueChange = (value: string) => {
    setSelectedFolder(value);
    onSelect(value);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <Select onValueChange={handleValueChange} value={selectedFolder}>
        <SelectTrigger>
          <SelectValue placeholder="Select folder" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="uploads/">Default (uploads/)</SelectItem>
          {folders.map((folder) => (
            <SelectItem key={folder.name} value={folder.name}>
              {folder.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
