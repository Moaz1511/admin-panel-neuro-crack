import { useState } from 'react';
import { DocsToExcelService } from '../services/docs-to-excel.service';

export function useDocsToExcel() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const convertDocToExcel = async (file: File): Promise<{ blob: Blob | null, filename: string }> => {
    setIsLoading(true);
    setError(null);
    try {
      return await DocsToExcelService.convertDocToExcel(file);
    } catch (err: any) {
      setError(err?.message || 'Failed to convert file');
      return { blob: null, filename: 'output.xlsx' };
    } finally {
      setIsLoading(false);
    }
  };

  return { convertDocToExcel, isLoading, error };
} 