'use client'

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileUpload } from '@/components/ui/file-upload';
import { axiosInstance } from '@/lib/api/api-caller';
import { baseUrl } from '@/lib/api/api-endpoints';

import withAdminAuth from '@/components/shared/withAdminAuth';

import { MediaUploader } from '@/components/features/quiz/MediaUploader';

function UploadQuizPage() {
  const [file, setFile] = useState<File | null>(null);
  const [googleSheetLink, setGoogleSheetLink] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<{ name: string; link: string }[]>([]);

  const handleUploadSuccess = (newImages: { name: string; link: string }[]) => {
    setUploadedImages(prev => [...prev, ...newImages]);
    alert('Upload successful!');
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
    <div className="p-8 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Upload Quiz Data</CardTitle>
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
            {isSubmitting ? 'Uploading...' : 'Upload Data'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upload Media</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <MediaUploader mode="single" onUploadSuccess={handleUploadSuccess} />
            <MediaUploader mode="bulk" onUploadSuccess={handleUploadSuccess} />
          </div>

          {uploadedImages.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold border-b pb-2 mb-4">Uploaded Images History</h3>
              <div className="max-h-64 overflow-y-auto border rounded-md">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="p-2">File Name</th>
                      <th className="p-2">Link</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {uploadedImages.map((image, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="p-2">{image.name}</td>
                        <td className="p-2">
                          <a href={image.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate block max-w-xs">
                            {image.link}
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default withAdminAuth(UploadQuizPage);

