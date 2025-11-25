// src/components/shared/backend-status-loader.tsx
'use client';

import { BrainCircuit } from "lucide-react";

export function BackendStatusLoader({ status }: { status: string }) {
  return (
    <div className="fixed inset-0 bg-gray-950 flex flex-col items-center justify-center z-[100]">
      <div className="relative flex items-center justify-center h-48 w-48">
        <div className="absolute inset-0 bg-blue-500/10 rounded-full animate-pulse"></div>
        <BrainCircuit className="h-24 w-24 text-blue-400" />
      </div>
      <p className="text-lg text-gray-300 mt-8 animate-pulse">{status}</p>
    </div>
  );
}
