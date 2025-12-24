import { axiosInstance } from '../api-caller';

export const uploadService = {
  uploadFile: async (file: File, context?: string) => {
    const formData = new FormData();
    formData.append('file', file);
    if (context) {
      formData.append('context', context);
    }

    try {
      const response = await axiosInstance.post<{ filePath: string }>('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // The interceptor returns response.data directly, 
      // so 'response' here is actually the object { filePath: string }
      return (response as any).filePath; 
    } catch (error) {
      console.error('File upload failed:', error);
      throw error;
    }
  },
};
