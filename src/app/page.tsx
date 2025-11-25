'use client';

import { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import { BackendStatusLoader } from '@/components/shared/backend-status-loader';

export default function HomePage() {
  const [isBackendReady, setIsBackendReady] = useState(false);
  const [status, setStatus] = useState('Initializing...');

  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 15; // 30 seconds timeout (15 attempts * 2 seconds)
    const interval = 2000; // 2 seconds

    const checkBackendStatus = async () => {
      attempts++;
      setStatus(`Connecting to server... (Attempt ${attempts})`);

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/health`);
        if (response.ok) {
          setStatus('Connection successful! Redirecting...');
          setIsBackendReady(true);
          return;
        }
      } catch (error) {
        // Ignore fetch errors, we'll retry
      }

      if (attempts >= maxAttempts) {
        setStatus('Failed to connect to the server. Please try again later.');
      } else {
        setTimeout(checkBackendStatus, interval);
      }
    };

    checkBackendStatus();

  }, []);

  if (isBackendReady) {
    redirect('/login');
  }

  return <BackendStatusLoader status={status} />;
}
