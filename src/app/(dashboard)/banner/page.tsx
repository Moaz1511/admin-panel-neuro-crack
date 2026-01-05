'use client'

import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, Upload, Loader2, Image as ImageIcon, X } from 'lucide-react';
import { axiosInstance } from '@/lib/api/api-caller';
import { ApiEndpoints } from '@/lib/api/api-endpoints';
import { toast } from 'sonner';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import NextImage from 'next/image';
import { useAuthStore } from '@/lib/store/auth-store';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';

interface Banner {
  id: string;
  title: string;
  image_url: string;
  is_active: boolean;
  created_at: string;
}

export default function BannerPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  // New Banner State
  const [newBannerTitle, setNewBannerTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dialog State
  const [dialogState, setDialogState] = useState({
    isOpen: false,
    title: '',
    description: '',
    onConfirm: () => {},
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1
  });

  const openDialog = (title: string, description: string, onConfirm: () => void) => {
    setDialogState({ isOpen: true, title, description, onConfirm });
  };

  const closeDialog = () => {
    setDialogState({ isOpen: false, title: '', description: '', onConfirm: () => {} });
  };

  useEffect(() => {
    if (user?.role !== 'admin') {
      router.push('/dashboard');
      return;
    }
    fetchBanners();
  }, [user, router]);

  // Clean up preview URL when component unmounts or file changes
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const fetchBanners = async () => {
    setIsLoading(true);
    try {
      const response: any = await axiosInstance.get(ApiEndpoints.banners.base);
      // The backend wraps the data in a standardized response object
      // response comes as { status: 'success', message: '...', data: [...] }
      setBanners(response.data || []); 
    } catch (error) {
      console.error('Error fetching banners:', error);
      toast.error('Failed to load banners');
    } finally {
      setIsLoading(false);
    }
  };

  const clearSelectedFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleUploadBanner = async () => {
    if (!newBannerTitle.trim()) {
      toast.error('Please enter a banner title');
      return;
    }
    if (!selectedFile) {
      toast.error('Please select an image file');
      return;
    }

    setIsUploading(true);
    try {
      // 1. Upload Image
      const formData = new FormData();
      formData.append('file', selectedFile);
      // Optional: Add path if backend supports it to organize uploads
      formData.append('path', 'banners/'); 

      const uploadResponse: any = await axiosInstance.post(ApiEndpoints.banners.upload, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Fix: axiosInstance interceptor returns response.data directly
      const imageUrl = uploadResponse.url;

      // 2. Create Banner Record
      await axiosInstance.post(ApiEndpoints.banners.base, {
        title: newBannerTitle,
        image_url: imageUrl,
      });

      toast.success('Banner created successfully');
      
      // Reset form
      setNewBannerTitle('');
      setSelectedFile(null);
      setPreviewUrl(null);
      
      fetchBanners();
    } catch (error) {
      console.error('Error uploading banner:', error);
      toast.error('Failed to create banner');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteBanner = (id: string) => {
    openDialog(
      'Delete Banner',
      'Are you sure you want to delete this banner? This action cannot be undone.',
      async () => {
        try {
          await axiosInstance.delete(`${ApiEndpoints.banners.base}/${id}`);
          toast.success('Banner deleted successfully');
          fetchBanners();
        } catch (error) {
          console.error('Error deleting banner:', error);
          toast.error('Failed to delete banner');
        }
      }
    );
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      // Optimistic update
      setBanners(banners.map(b => b.id === id ? { ...b, is_active: !currentStatus } : b));
      
      await axiosInstance.patch(`${ApiEndpoints.banners.base}/${id}/status`, {
        is_active: !currentStatus
      });
      toast.success('Banner status updated');
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
      // Revert on error
      fetchBanners();
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <ConfirmationDialog
        isOpen={dialogState.isOpen}
        onClose={closeDialog}
        onConfirm={dialogState.onConfirm}
        title={dialogState.title}
        description={dialogState.description}
      />

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Banner Management</h1>
          <p className="text-muted-foreground mt-2">Manage homepage banners and promotional images.</p>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Upload Form */}
        <Card className="md:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Add New Banner</CardTitle>
            <CardDescription>Upload a new banner image.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Title
              </label>
              <Input
                placeholder="Enter banner title"
                value={newBannerTitle}
                onChange={(e) => setNewBannerTitle(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Banner Image
              </label>
              <div 
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors relative overflow-hidden min-h-[200px] ${
                  isDragActive ? 'border-primary bg-primary/10' : 'border-muted-foreground/25 hover:bg-accent/50'
                }`}
              >
                <input {...getInputProps()} />
                
                {previewUrl ? (
                   <div className="w-full h-full absolute inset-0">
                     <NextImage 
                       src={previewUrl} 
                       alt="Preview" 
                       fill 
                       className="object-contain p-2"
                     />
                     <div className="absolute top-2 right-2 z-10">
                       <Button 
                         variant="destructive" 
                         size="icon" 
                         className="h-6 w-6 rounded-full shadow-md"
                         onClick={clearSelectedFile}
                       >
                         <X className="h-3 w-3" />
                       </Button>
                     </div>
                   </div>
                ) : (
                  <div className="text-center p-4">
                    <div className="bg-primary/10 p-3 rounded-full w-fit mx-auto mb-3">
                      <Upload className="h-6 w-6 text-primary" />
                    </div>
                    {isDragActive ? (
                      <p className="text-sm font-medium text-primary">Drop image here</p>
                    ) : (
                      <>
                        <p className="text-sm font-medium">Click or drag image here</p>
                        <p className="text-xs text-muted-foreground mt-1">Supports JPG, PNG, WEBP</p>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            <Button 
              className="w-full" 
              onClick={handleUploadBanner} 
              disabled={isUploading || !selectedFile || !newBannerTitle}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Banner
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Banners List */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Existing Banners</CardTitle>
            <CardDescription>Manage your active banners.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : banners.length === 0 ? (
              <div className="text-center p-8 text-muted-foreground">
                No banners found. Add one to get started.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {banners.map((banner) => (
                    <TableRow key={banner.id}>
                      <TableCell>
                        <div className="relative h-12 w-20 overflow-hidden rounded-md border bg-muted">
                          <NextImage 
                            src={banner.image_url} 
                            alt={banner.title} 
                            fill 
                            className="object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{banner.title}</TableCell>
                      <TableCell>
                        <Switch 
                          checked={banner.is_active} 
                          onCheckedChange={() => handleToggleStatus(banner.id, banner.is_active)}
                        />
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {new Date(banner.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleDeleteBanner(banner.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
