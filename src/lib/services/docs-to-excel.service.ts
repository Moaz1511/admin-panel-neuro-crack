import { axiosInstance } from '../api/api-caller';
import { ApiEndpoints } from '../api/api-endpoints';


export class DocsToExcelService {
  static async convertDocToExcel(file: File): Promise<Blob> {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await axiosInstance.post(ApiEndpoints.ai.uploadDocx, formData, {
        responseType: 'blob',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data as Blob;
    } catch (error: unknown) {
      // Re-throwing the error to be handled by the caller
      throw error;
    }
  }
} 