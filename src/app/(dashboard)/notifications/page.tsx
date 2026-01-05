'use client'

import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, Upload, Loader2, Image as ImageIcon, X, Send, Edit } from 'lucide-react';
import { axiosInstance } from '@/lib/api/api-caller';
import { ApiEndpoints } from '@/lib/api/api-endpoints';
import { toast } from 'sonner';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import NextImage from 'next/image';
import { useAuthStore } from '@/lib/store/auth-store';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';

interface Notification {
  id: string;
  title: string;
  body: string | null;
  image_url: string | null;
  created_at: string;
}

export default function NotificationPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  
  // New Notification State
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  // Editing State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  
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
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif']
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
    fetchNotifications();
  }, [user, router]);

  // Clean up preview URL
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const response: any = await axiosInstance.get(ApiEndpoints.notifications.base);
      setNotifications(response.data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  };

  const clearSelectedFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    setPreviewUrl(null);
    if (editingId && existingImageUrl) {
        // If we are editing and clear the *new* file, we might want to revert to the existing image 
        // OR if the user wants to remove the existing image entirely.
        // For simplicity, if they clear the preview, it means "no image".
        setExistingImageUrl(null);
    }
  };

  const handleEditClick = (notification: Notification) => {
    setEditingId(notification.id);
    setTitle(notification.title);
    setBody(notification.body || '');
    setExistingImageUrl(notification.image_url);
    setPreviewUrl(notification.image_url);
    setSelectedFile(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setTitle('');
    setBody('');
    setExistingImageUrl(null);
    setPreviewUrl(null);
    setSelectedFile(null);
  };

  const handleSendNotification = async () => {
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }

    setIsSending(true);
    try {
      let imageUrl = existingImageUrl || ''; // Default to existing if not changed

      // 1. Upload Image/GIF if selected (overrides existing)
      if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('path', 'notifications/'); 

        const uploadResponse: any = await axiosInstance.post(`${ApiEndpoints.banners.upload}`, formData, { 
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        imageUrl = uploadResponse.url;
      } else if (previewUrl === null) {
          // If preview is cleared, it means remove image
          imageUrl = '';
      }

      // 2. Create or Update Notification Record
      if (editingId) {
        await axiosInstance.put(`${ApiEndpoints.notifications.base}/${editingId}`, {
            title,
            body,
            image_url: imageUrl || undefined,
        });
        toast.success('Notification updated successfully');
        setEditingId(null); // Exit edit mode
      } else {
        await axiosInstance.post(ApiEndpoints.notifications.base, {
            title,
            body,
            image_url: imageUrl || undefined,
        });
        toast.success('Notification sent successfully');
      }
      
      // Reset form
      setTitle('');
      setBody('');
      setSelectedFile(null);
      setPreviewUrl(null);
      setExistingImageUrl(null);
      
      fetchNotifications();
    } catch (error) {
      console.error('Error sending/updating notification:', error);
      toast.error(editingId ? 'Failed to update notification' : 'Failed to send notification');
    } finally {
      setIsSending(false);
    }
  };

  const handleDeleteNotification = (id: string) => {
    openDialog(
      'Delete Notification',
      'Are you sure you want to delete this notification history?',
      async () => {
        try {
          await axiosInstance.delete(`${ApiEndpoints.notifications.base}/${id}`);
          toast.success('Notification deleted');
          fetchNotifications();
        } catch (error) {
          console.error('Error deleting notification:', error);
          toast.error('Failed to delete notification');
        }
      }
    );
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
          <h1 className="text-3xl font-bold tracking-tight">Notification Center</h1>
          <p className="text-muted-foreground mt-2">Send broadcast notifications to all users.</p>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Compose Form */}
        <Card className="md:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Notification' : 'Compose Notification'}</CardTitle>
            <CardDescription>{editingId ? 'Update message details.' : 'Send a new message.'}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">
                Title <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Notification Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">
                Body
              </label>
              <Textarea
                placeholder="Notification Body (Optional)"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={4}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">
                Image / GIF (Optional)
              </label>
              <div 
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors relative overflow-hidden min-h-[150px] ${
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
                      <ImageIcon className="h-6 w-6 text-primary" />
                    </div>
                    {isDragActive ? (
                      <p className="text-sm font-medium text-primary">Drop here</p>
                    ) : (
                      <>
                        <p className="text-sm font-medium">Click or drag</p>
                        <p className="text-xs text-muted-foreground mt-1">JPG, PNG, GIF</p>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2 w-full">
                <Button 
                className={editingId ? "flex-1" : "w-full"} 
                onClick={handleSendNotification} 
                disabled={isSending || !title}
                >
                {isSending ? (
                    <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {editingId ? 'Updating...' : 'Sending...'}
                    </>
                ) : (
                    <>
                    <Send className="mr-2 h-4 w-4" />
                    {editingId ? 'Update Notification' : 'Send Notification'}
                    </>
                )}
                </Button>
                {editingId && (
                    <Button variant="outline" className="flex-1" onClick={handleCancelEdit}>
                        Cancel
                    </Button>
                )}
            </div>
          </CardContent>
        </Card>

        {/* History List */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>History</CardTitle>
            <CardDescription>Recently sent notifications.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center p-8 text-muted-foreground">
                No notification history found.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Preview</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notifications.map((notification) => (
                    <TableRow key={notification.id}>
                      <TableCell>
                        {notification.image_url ? (
                          <div className="relative h-12 w-20 overflow-hidden rounded-md border bg-muted">
                            <NextImage 
                              src={notification.image_url} 
                              alt="Preview" 
                              fill 
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="h-12 w-20 bg-muted rounded-md flex items-center justify-center text-xs text-muted-foreground">
                            Text Only
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{notification.title}</div>
                        {notification.body && (
                          <div className="text-sm text-muted-foreground truncate max-w-[300px]">
                            {notification.body}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                        {new Date(notification.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                            <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleEditClick(notification)}
                            >
                            <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleDeleteNotification(notification.id)}
                            >
                            <Trash2 className="h-4 w-4" />
                            </Button>
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
    </div>
  );
}
