import axios from 'axios';
import { ApiEndpoints } from '../api/api-endpoints';


export class DocsToExcelService {
  static async convertDocToExcel(file: File): Promise<Blob> {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await axios.post(ApiEndpoints.ai.uploadDocx, formData, {
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