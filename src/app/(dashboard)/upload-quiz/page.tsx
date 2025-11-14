'use client'

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileUpload } from '@/components/ui/file-upload';
import axios from 'axios';
import { baseUrl } from '@/lib/api/api-endpoints';

export default function UploadQuizPage() {
  const [file, setFile] = useState<File | null>(null);
  const [googleSheetLink, setGoogleSheetLink] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);


  const handleSubmit = async () => {
    setIsSubmitting(true);
    const formData = new FormData();
    if (file) {
      formData.append('file', file);
    } else if (googleSheetLink) {
      formData.append('googleSheetLink', googleSheetLink);
    }

    try {
      await axios.post(`${baseUrl}/api/quizzes/bulk-upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
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
    </div>
  );
}
