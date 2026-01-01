'use client'

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Folder, File as FileIcon, Upload, Share, Trash2, Edit, List, Grid } from 'lucide-react';
import { axiosInstance } from '@/lib/api/api-caller';
import axios from 'axios';
import { ApiEndpoints } from '@/lib/api/api-endpoints';
import { MediaFileUpload } from '@/components/ui/media-file-upload';
import { toast } from 'sonner';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import NextImage from 'next/image';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useAuthStore } from '@/lib/store/auth-store';
import { useRouter } from 'next/navigation';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface File {
  name: string;
  url: string;
  size: number;
  lastModified: Date;
  key: string;
}

interface Folder {
  name: string;
}

function MediaManagerPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [folders, setFolders] = useState<Folder[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [currentPrefix, setCurrentPrefix] = useState('');
  const [newFolderName, setNewFolderName] = useState('');
  const [renamingFile, setRenamingFile] = useState<File | null>(null);
  const [newFileName, setNewFileName] = useState('');
  const [imageViewSrc, setImageViewSrc] = useState<string | null>(null);
  const [dialogState, setDialogState] = useState({
    isOpen: false,
    title: '',
    description: '',
    onConfirm: () => {},
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  const openDialog = (title: string, description: string, onConfirm: () => void) => {
    setDialogState({ isOpen: true, title, description, onConfirm });
  };

  const closeDialog = () => {
    setDialogState({ isOpen: false, title: '', description: '', onConfirm: () => {} });
  };

  useEffect(() => {
    if (user?.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [user, router]);

  useEffect(() => {
    fetchFilesAndFolders();
  }, [currentPrefix, sortBy, sortOrder]);

  const fetchFilesAndFolders = async () => {
    try {
      const response: any = await axiosInstance.get(`${ApiEndpoints.mediaManager.files}?prefix=${currentPrefix}&sortBy=${sortBy}&order=${sortOrder}`);
      setFiles(response.files);
      setFolders(response.folders);
    } catch (error) {
      console.log(error);
      console.error('Error fetching files and folders:', error);
    }
  };

  const handleCreateFolder = async () => {
    if (newFolderName.trim() !== '') {
      try {
        await axiosInstance.post(`${ApiEndpoints.mediaManager.folder}?prefix=${currentPrefix}`, { folderName: newFolderName });
        setNewFolderName('');
        fetchFilesAndFolders();
      } catch (error) {
        console.error('Error creating folder:', error);
      }
    }
  };

  const handleFolderClick = (folderName: string) => {
    setCurrentPrefix(`${currentPrefix}${folderName}/`);
  };

  const handleBreadcrumbClick = (index: number) => {
    const prefixes = currentPrefix.split('/').slice(0, index + 1);
    setCurrentPrefix(prefixes.join('/') + '/');
  };
  
  const handleRootClick = () => {
    setCurrentPrefix('');
  };

  const handleFileUpload = async (uploadedFiles: any[]) => {
    for (const file of uploadedFiles) {
      try {
        const response: any = await axiosInstance.post(`${ApiEndpoints.mediaManager.signedUrlUpload}?prefix=${currentPrefix}`, {
          fileName: file.name,
          contentType: file.type,
        });
        const { presignedUrl } = response;
        await axios.put(presignedUrl, file, {
          headers: {
            'Content-Type': file.type,
          },
        });
        toast.success('File uploaded successfully');
      } catch (error) {
        console.error('Error uploading file:', file.name, error);
      }
    }
    fetchFilesAndFolders();
  };

  const handleDeleteFile = async (fileName: string) => {
    openDialog(
      'Delete File',
      'Are you sure you want to delete this file?',
      async () => {
        try {
          await axiosInstance.delete(ApiEndpoints.mediaManager.file, {
            data: { fileName, prefix: currentPrefix },
          });
          fetchFilesAndFolders();
        } catch (error) {
          console.error('Error deleting file:', error);
        }
      }
    );
  };

  const handleDeleteFolder = async (folderName: string) => {
    openDialog(
      'Delete Folder',
      'Are you sure you want to delete this folder and all its contents?',
      async () => {
        try {
          await axiosInstance.delete(ApiEndpoints.mediaManager.folder, {
            data: { prefix: `${currentPrefix}${folderName}/` },
          });
          fetchFilesAndFolders();
        } catch (error) {
          console.error('Error deleting folder:', error);
        }
      }
    );
  };

  const handleReplaceFile = async (file: File, newFile: any) => {
    try {
      const response: any = await axiosInstance.post(ApiEndpoints.mediaManager.signedUrlReplace, {
        key: file.key,
        contentType: newFile.type,
      });
      const { presignedUrl } = response;
      await axios.put(presignedUrl, newFile, {
        headers: {
          'Content-Type': newFile.type,
        },
      });
      toast.success('File replaced successfully');
      fetchFilesAndFolders();
    } catch (error) {
      console.error('Error replacing file:', error);
    }
  };

  const handleRenameFile = async (file: File) => {
    if (newFileName.trim() !== '') {
      try {
        const newKey = `${currentPrefix}${newFileName}`;
        await axiosInstance.post(ApiEndpoints.mediaManager.fileRename, {
          oldKey: file.key,
          newKey: newKey,
        });
        setRenamingFile(null);
        setNewFileName('');
        fetchFilesAndFolders();
      } catch (error) {
        console.error('Error renaming file:', error);
      }
    }
  };

  const handleShareLink = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard');
  };

  const handleExportCsv = async () => {
    try {
      const response: any = await axiosInstance.get(`${ApiEndpoints.mediaManager.exportCsv}?prefix=${currentPrefix}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'links.csv');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error exporting CSV:', error);
    }
  };


  return (
    <div className="p-8">
      <ConfirmationDialog
        isOpen={dialogState.isOpen}
        onClose={closeDialog}
        onConfirm={dialogState.onConfirm}
        title={dialogState.title}
        description={dialogState.description}
      />
      {imageViewSrc && (
        <Dialog open={!!imageViewSrc} onOpenChange={() => setImageViewSrc(null)}>
          <DialogContent className="max-w-screen-lg">
            <div className="relative h-[80vh] w-full">
              <NextImage src={imageViewSrc} alt="Image preview" layout="fill" objectFit="contain" />
            </div>
          </DialogContent>
        </Dialog>
      )}
      <Card>
        <CardHeader>
          <CardTitle>Media Manager</CardTitle>
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleExportCsv}>
                <Share className="mr-2 h-4 w-4" /> Export Links (CSV)
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <select 
                className="border rounded p-1 text-sm bg-background"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="name">Name</option>
                <option value="date">Date</option>
                <option value="size">Size</option>
              </select>
              <Button variant="ghost" size="sm" onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
                {sortOrder === 'asc' ? 'Asc' : 'Desc'}
              </Button>
              <div className="h-4 w-[1px] bg-gray-300 mx-1"></div>
              <Button variant="ghost" size="sm" onClick={() => setViewMode('list')}>
                <List className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setViewMode('grid')}>
                <Grid className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Input
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="New folder name"
            />
            <Button onClick={handleCreateFolder}>Create Folder</Button>
          </div>
        </CardHeader>
        <CardContent>
          <MediaFileUpload onUpload={handleFileUpload} prefix={currentPrefix} />
          <div className="flex items-center gap-2 mb-4 mt-4">
            <Button variant="link" onClick={handleRootClick}>Root</Button>
            {currentPrefix.split('/').filter(Boolean).map((prefix, index) => (
              <div key={index} className="flex items-center gap-2">
                <span>/</span>
                <Button variant="link" onClick={() => handleBreadcrumbClick(index)}>
                  {prefix}
                </Button>
              </div>
            ))}
          </div>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {folders.map((folder) => (
                <div key={folder.name} className="border rounded-lg p-4 flex flex-col items-center gap-2">
                  <div onClick={() => handleFolderClick(folder.name)} className="cursor-pointer">
                      <Folder className="h-16 w-16" />
                      <span className="text-sm font-medium">{folder.name}</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteFolder(folder.name)}>
                      <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {files.map((file) => (
                <div key={file.name} className="border rounded-lg p-4 flex flex-col items-center gap-2">
                  {renamingFile?.key === file.key ? (
                    <div className="flex gap-2">
                      <Input
                        value={newFileName}
                        onChange={(e) => setNewFileName(e.target.value)}
                        placeholder="New file name"
                      />
                      <Button onClick={() => handleRenameFile(file)}>Save</Button>
                    </div>
                  ) : (
                    <>
                      {file.url.match(/\.(jpeg|jpg|gif|png)$/) ? (
                          <div onClick={() => setImageViewSrc(file.url)} className="cursor-pointer">
                              <NextImage src={file.url} alt={file.name} width={64} height={64} className="h-16 w-16 object-cover" />
                          </div>
                      ) : (
                          <FileIcon className="h-16 w-16" />
                      )}
                      <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium hover:underline truncate flex-grow min-w-0">
                        {file.name}
                      </a>
                      <div className="flex gap-2 mt-2">
                        <Button variant="ghost" size="sm" onClick={() => { setRenamingFile(file); setNewFileName(file.name); }}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteFile(file.name)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleShareLink(file.url)}>
                          <Share className="h-4 w-4" />
                        </Button>
                        <Input
                          type="file"
                          className="hidden"
                          id={`replace-${file.key}`}
                          onChange={(e) => {
                            if (e.target.files) {
                              handleReplaceFile(file, e.target.files[0]);
                            }
                          }}
                        />
                        <label htmlFor={`replace-${file.key}`} className="cursor-pointer">
                          <Button variant="ghost" size="sm">
                            <Upload className="h-4 w-4" />
                          </Button>
                        </label>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Last Modified</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {folders.map((folder) => (
                  <TableRow key={folder.name} onDoubleClick={() => handleFolderClick(folder.name)}>
                    <TableCell className="font-medium flex items-center gap-2">
                      <Folder className="h-4 w-4" />
                      {folder.name}
                    </TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteFolder(folder.name)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {files.map((file) => (
                  <TableRow key={file.name}>
                    <TableCell className="font-medium flex items-center gap-2">
                      {file.url.match(/\.(jpeg|jpg|gif|png)$/) ? (
                        <div onClick={() => setImageViewSrc(file.url)} className="cursor-pointer">
                          <NextImage src={file.url} alt={file.name} width={24} height={24} className="h-6 w-6 object-cover" />
                        </div>
                      ) : (
                        <FileIcon className="h-4 w-4" />
                      )}
                      <a href={file.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        {file.name}
                      </a>
                    </TableCell>
                    <TableCell>{new Date(file.lastModified).toLocaleString()}</TableCell>
                    <TableCell>{(file.size / 1024).toFixed(2)} KB</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => { setRenamingFile(file); setNewFileName(file.name); }}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteFile(file.name)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleShareLink(file.url)}>
                          <Share className="h-4 w-4" />
                        </Button>
                        <Input
                          type="file"
                          className="hidden"
                          id={`replace-${file.key}`}
                          onChange={(e) => {
                            if (e.target.files) {
                              handleReplaceFile(file, e.target.files[0]);
                            }
                          }}
                        />
                        <label htmlFor={`replace-${file.key}`} className="cursor-pointer">
                          <Button variant="ghost" size="sm">
                            <Upload className="h-4 w-4" />
                          </Button>
                        </label>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default MediaManagerPage;