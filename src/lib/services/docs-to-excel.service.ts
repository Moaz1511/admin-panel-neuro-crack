import axios from 'axios';
import { ApiEndpoints } from '../api/api-endpoints';


export class DocsToExcelService {
  static async convertDocToExcel(file: File): Promise<{ blob: Blob, filename: string }> {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await axios.post(ApiEndpoints.ai.uploadDocx, formData, {
        responseType: 'blob',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // Get filename from content-disposition header if present
      let filename = 'output.xlsx';
      const disposition = response.headers['content-disposition'];
      if (disposition && disposition.includes('filename=')) {
        filename = disposition.split('filename=')[1].replace(/"/g, '');
      }
      return { blob: response.data as Blob, filename };
    } catch (error: any) {
      throw error?.response?.data || error.message || 'Failed to convert file';
    }
  }
} 