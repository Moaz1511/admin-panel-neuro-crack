"use client";

import { useAuth } from '@/lib/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const withAdminAuth = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  const Wrapper = (props: P) => {
    const { isAuthenticated, role, isAuthLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isAuthLoading) {
        if (!isAuthenticated) {
          router.replace('/login');
        } else if (role !== 'admin') {
          router.replace('/dashboard'); // Redirect non-admins to the dashboard
        }
      }
    }, [isAuthenticated, role, isAuthLoading, router]);

    // While loading or if not an admin, show a loading spinner or null
    if (isAuthLoading || role !== 'admin') {
      return (
        <div className="flex h-screen items-center justify-center bg-background">
          <div className="relative w-24 h-24">
            <div className="absolute top-0 left-0 w-full h-full border-8 border-primary/30 rounded-full"></div>
            <div className="absolute top-0 left-0 w-full h-full border-8 border-primary rounded-full animate-spin border-t-transparent"></div>
          </div>
        </div>
      );
    }

    // If authenticated and an admin, render the component
    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default withAdminAuth;
