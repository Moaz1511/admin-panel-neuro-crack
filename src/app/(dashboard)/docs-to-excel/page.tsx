"use client";
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { UploadCloud, FileText, FileSpreadsheet, Loader2, Download, RefreshCw, Eye, CircleMinus, Database, Edit, CircleAlert } from "lucide-react";
import { toast } from 'sonner';
import { useDocsToExcel } from '@/lib/hooks/use-docs-to-excel';
import * as XLSX from 'xlsx';

const showErrorToast = (message: string) => {
    toast(message, {
      icon: React.createElement(CircleAlert, {
        className: "text-red-500",
        size: 20
      }),
      style: { color: 'black' }
    })
  }

export default function DocsToExcelPage() {
  const [file, setFile] = useState<File | null>(null);
  const [excelBlob, setExcelBlob] = useState<Blob | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [sheetData, setSheetData] = useState<any[][] | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { convertDocToExcel, isLoading } = useDocsToExcel();

  // Always clear file input and state before new upload
  const clearFile = () => {
    setFile(null);
    setExcelBlob(null);
    setUploadProgress(0);
    setIsUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (!selected.name.match(/\.(doc|docx)$/i)) {
        showErrorToast("Only .doc and .docx files are allowed.");
        if (inputRef.current) inputRef.current.value = "";
        return;
      }
      setFile(selected);
      setExcelBlob(null);
      setUploadProgress(0);
      setIsUploading(true);
      if (inputRef.current) inputRef.current.value = "";
      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          setIsUploading(false);
        }
      }, 80);
    }
  };

  const handleUploadClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.click();
    }
  };

  const handleChangeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.click();
    }
  };

  const handleResetFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    clearFile();
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) {
      if (!dropped.name.match(/\.(doc|docx)$/i)) {
        showErrorToast("Only .doc and .docx files are allowed.");
        if (inputRef.current) inputRef.current.value = "";
        return;
      }
      setFile(dropped);
      setExcelBlob(null);
      setUploadProgress(0);
      setIsUploading(true);
      if (inputRef.current) inputRef.current.value = "";
      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          setIsUploading(false);
        }
      }, 80);
    }
  };

  const handleConvert = async () => {
    if (!file) {
      showErrorToast("Please upload a .doc or .docx file first.");
      return;
    }
    setExcelBlob(null);
    try {
      const blob = await convertDocToExcel(file);
      if (blob) {
        setExcelBlob(blob);
        toast.success('Conversion successful! You can now download your Excel file.');
      } else {
        showErrorToast('Failed to convert file.');
      }
    } catch (err: any) {
      showErrorToast(err?.message || 'Failed to convert file.');
    }
  };

  const handleViewSheet = async () => {
    if (!excelBlob) return;
    setShowPreview(true);
    // Read the blob as ArrayBuffer and parse with XLSX
    const arrayBuffer = await excelBlob.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    setSheetData(data as any[][]);
  };

  const handleDownload = () => {
    if (!excelBlob) return;
    const url = window.URL.createObjectURL(excelBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = (file?.name?.replace(/\.(doc|docx)$/i, '') || 'converted') + '.xlsx';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }, 0);
  };

  return (
    <div className="w-full mx-auto px-4 py-4 min-h-[80vh]">
      {!file ? (
        <div
          className={`flex flex-col items-center justify-center w-full max-w-lg h-[350px] rounded-2xl border-2 border-dashed transition-colors duration-200 ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'} cursor-pointer shadow-lg p-8 mx-auto mt-24`}
          onClick={handleUploadClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".doc,.docx"
            className="hidden"
            onChange={handleFileChange}
          />
          <UploadCloud className="h-16 w-16 text-blue-400 mb-4" />
          <h2 className="text-xl font-semibold mb-2 text-gray-700">Drag & Drop your .doc or .docx file here</h2>
          <p className="text-gray-500 mb-2">or <span className="text-blue-600 underline">click to browse</span> from your computer</p>
          <p className="text-xs text-gray-400">Only .doc and .docx files are allowed. Max file size: 10MB.</p>
        </div>
      ) : (
        <div className="w-full mt-0 ml-0">
          <input
            ref={inputRef}
            type="file"
            accept=".doc,.docx"
            className="hidden"
            onChange={handleFileChange}
          />
          <div className="flex items-center gap-4 mb-8">
            <div className="p-2 rounded-xl bg-primary/10">
              <FileSpreadsheet className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-md font-bold">Docs to Excel Converter</h1>
              <p className="text-muted-foreground text-xs">Upload your .doc or .docx file and convert it to Excel (.xls) format in seconds.</p>
            </div>
          </div>
          <div className="w-full mb-4">
            <div className="flex w-full gap-2 mb-3">
              <Button
                variant="outline"
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 text-blue-700 border-blue-200 bg-blue-50 hover:bg-blue-100"
                onClick={handleUploadClick}
                disabled={isLoading}
              >
                <UploadCloud className="h-5 w-5" />
                Upload .doc/.docx
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-2 px-4 py-3 text-gray-600 border-gray-200 bg-gray-50 hover:bg-gray-100"
                onClick={handleChangeFile}
                disabled={isLoading}
              >
                <RefreshCw className="h-4 w-4" />
                Change File
              </Button>

              <Button
                variant="outline"
                className="flex items-center gap-2 px-4 py-3 text-gray-600 border-gray-200 bg-gray-50 hover:bg-gray-100"
                onClick={handleResetFile}
                disabled={isLoading}
              >
                <CircleMinus className="h-4 w-4" />
                Reset File
              </Button>
            </div>
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md border border-gray-200">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-500" />
                <span className="text-sm text-gray-700 font-medium">{file.name}</span>
                <span className="text-xs text-gray-500">({(file.size / (1024 * 1024)).toFixed(2)} MB)</span>
              </div>
              <Button
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-400 text-white font-medium shadow-sm hover:from-blue-700 hover:to-blue-500"
                onClick={handleConvert}
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileSpreadsheet className="h-4 w-4" />}
                {isLoading ? 'Converting...' : 'Convert to Excel'}
              </Button>
            </div>
          </div>
          {isUploading && (
            <div className="w-full mb-4">
              <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
                <div
                  className="h-2 bg-blue-500 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-blue-500 mt-1">Uploading... {uploadProgress}%</p>
            </div>
          )}
          <div className="flex gap-4 mt-4 w-full mx-auto justify-end">
            <Button
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold shadow-md hover:bg-green-700"
              onClick={handleDownload}
              disabled={!excelBlob}
            >
              <Download className="h-5 w-5" />
              Download XLSX
            </Button>
            <Button
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700"
              onClick={handleViewSheet}
              disabled={!excelBlob}
            >
              <Eye className="h-5 w-5" />
              View Sheet
            </Button>
            <Button
              className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white font-semibold shadow-md hover:bg-purple-700"
            //   onClick={handleEditSheet}
              disabled={!excelBlob}
            >
              <Edit className="h-5 w-5" />
              Edit Sheet
            </Button>
            <Button
              className="flex items-center gap-2 px-6 py-3 bg-amber-600 text-white font-semibold shadow-md hover:bg-amber-700"
            //   onClick={handleUploadToDatabase}
              disabled={!excelBlob}
            >
              <Database className="h-5 w-5" />
              Upload to Database
            </Button>

          </div>
          {showPreview && sheetData && (
            <div className="mt-8 overflow-x-auto border rounded-lg bg-white shadow">
              <table className="min-w-full text-sm">
                <thead>
                  <tr>
                    {sheetData[0]?.map((cell, idx) => (
                      <th
                        key={idx}
                        className={
                          idx === 2
                            ? "px-4 py-2 bg-gray-100 font-bold border-b border-gray-200 text-left min-w-[12rem] max-w-2xl"
                            : "px-4 py-2 bg-gray-100 font-bold border-b border-gray-200 text-left w-48 max-w-xs truncate"
                        }
                        style={
                          idx === 2
                            ? { minWidth: '12rem', maxWidth: '40rem', whiteSpace: 'normal' }
                            : { width: '12rem', maxWidth: '16rem' }
                        }
                      >
                        {cell}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sheetData.slice(1).map((row, rowIdx) => (
                    <tr key={rowIdx}>
                      {row.map((cell, colIdx) => (
                        <td
                          key={colIdx}
                          className={
                            colIdx === 2
                              ? "px-4 py-2 border-b border-gray-100 min-w-[12rem] max-w-2xl whitespace-normal"
                              : "px-4 py-2 border-b border-gray-100 w-48 max-w-xs truncate"
                          }
                          style={
                            colIdx === 2
                              ? { minWidth: '12rem', maxWidth: '40rem', whiteSpace: 'normal', wordBreak: 'break-word' }
                              : { width: '12rem', maxWidth: '16rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }
                          }
                          title={colIdx === 2 ? undefined : (typeof cell === 'string' ? cell : String(cell))}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
        </div>
      )}
    </div>
  );
}
