'use client'

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileUpload } from '@/components/ui/file-upload';
import { axiosInstance } from '@/lib/api/api-caller';
import { baseUrl } from '@/lib/api/api-endpoints';

import withAdminAuth from '@/components/shared/withAdminAuth';

function UploadQuizPage() {
  const [file, setFile] = useState<File | null>(null);
  const [googleSheetLink, setGoogleSheetLink] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [uploadedImages, setUploadedImages] = useState<{ name: string; link: string }[]>([]);

  const handleImageSubmit = async () => {
    setIsSubmitting(true);
    const formData = new FormData();
    if (imageFile) {
      formData.append('file', imageFile);
    }

    try {
      const response = await axiosInstance.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setUploadedImages([...uploadedImages, { name: imageFile?.name || '', link: response.data.url }]);
      alert('Image upload successful!');
    } catch (error) {
      console.error('Error during image upload:', error);
      alert('Error during image upload. Please check the console for details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBulkImageSubmit = async () => {
    setIsSubmitting(true);
    const formData = new FormData();
    imageFiles.forEach((file) => {
      formData.append('files', file);
    });

    try {
      const response = await axiosInstance.post('/api/upload/bulk', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const newImages = response.data.urls.map((url: string, index: number) => ({
        name: imageFiles[index].name,
        link: url,
      }));
      setUploadedImages([...uploadedImages, ...newImages]);
      alert('Bulk image upload successful!');
    } catch (error) {
      console.error('Error during bulk image upload:', error);
      alert('Error during bulk image upload. Please check the console for details.');
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleSubmit = async () => {
    setIsSubmitting(true);
    const formData = new FormData();
    if (file) {
      formData.append('file', file);
    } else if (googleSheetLink) {
      formData.append('googleSheetLink', googleSheetLink);
    }

    try {
      await axiosInstance.post('/api/quizzes/bulk-upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 60000, // 60-second timeout for this specific request
      });
      alert('Bulk upload successful!');
    } catch (error) {
      console.error('Error during bulk upload:', error);
      alert('Error during bulk upload. Please check the console for details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8">
      <Card>
        <CardHeader>
          <CardTitle>Upload Quiz</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="file-upload">Upload CSV or JSON file</label>
            <Input type="file" id="file-upload" onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} />
          </div>
          <div className="text-center">OR</div>
          <div>
            <label htmlFor="google-sheet-link">Google Sheet Link</label>
            <Input
              id="google-sheet-link"
              value={googleSheetLink}
              onChange={(e) => setGoogleSheetLink(e.target.value)}
              placeholder="Enter Google Sheet link"
            />
          </div>
          <Button onClick={handleSubmit} disabled={isSubmitting || (!file && !googleSheetLink)}>
            {isSubmitting ? 'Uploading...' : 'Upload'}
          </Button>
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Upload Media</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="image-upload">Upload Single Image</label>
            <Input type="file" id="image-upload" onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)} />
             <Button onClick={handleImageSubmit} disabled={isSubmitting || !imageFile}>
              {isSubmitting ? 'Uploading...' : 'Upload Image'}
            </Button>
          </div>
          <div className="text-center">OR</div>
          <div>
            <label htmlFor="bulk-image-upload">Upload Bulk Images</label>
            <Input type="file" id="bulk-image-upload" multiple onChange={(e) => setImageFiles(Array.from(e.target.files || []))} />
            <Button onClick={handleBulkImageSubmit} disabled={isSubmitting || imageFiles.length === 0}>
              {isSubmitting ? 'Uploading...' : 'Upload Images'}
            </Button>
          </div>
          {uploadedImages.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold">Uploaded Images</h3>
              <table className="w-full mt-4">
                <thead>
                  <tr>
                    <th className="text-left">File Name</th>
                    <th className="text-left">Cloudflare Link</th>
                  </tr>
                </thead>
                <tbody>
                  {uploadedImages.map((image, index) => (
                    <tr key={index}>
                      <td>{image.name}</td>
                      <td>
                        <a href={image.link} target="_blank" rel="noopener noreferrer">
                          {image.link}
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default withAdminAuth(UploadQuizPage);

