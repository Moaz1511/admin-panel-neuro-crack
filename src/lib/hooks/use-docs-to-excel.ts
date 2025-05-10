import { useState } from 'react';
import { DocsToExcelService } from '../services/docs-to-excel.service';

export function useDocsToExcel() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const convertDocToExcel = async (file: File): Promise<Blob | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const blob = await DocsToExcelService.convertDocToExcel(file);
      return blob;
    } catch (err: any) {
      setError(err?.message || 'Failed to convert file');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { convertDocToExcel, isLoading, error };
} 