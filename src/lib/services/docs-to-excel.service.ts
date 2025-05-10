import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/upload-docx';

export class DocsToExcelService {
  static async convertDocToExcel(file: File): Promise<Blob> {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await axios.post(API_URL, formData, {
        responseType: 'blob',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data as Blob;
    } catch (error: any) {
      throw error?.response?.data || error.message || 'Failed to convert file';
    }
  }
} 