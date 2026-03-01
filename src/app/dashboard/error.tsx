'use client';

import { useEffect } from 'react';
import { AlertCircle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service like Sentry
    console.error('Dashboard ErrorBoundary caught:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 space-y-6 animate-in fade-in duration-500">
      <div className="bg-red-100 p-4 rounded-full">
        <AlertCircle className="w-10 h-10 text-red-600" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Something went wrong!</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          An unexpected error occurred while loading this dashboard page.
          {error.message && (
            <span className="block mt-2 text-sm bg-muted p-2 rounded-md font-mono text-left break-all">
              {error.message}
            </span>
          )}
        </p>
      </div>
      
      <div className="flex gap-4 mt-6">
        <Button 
          onClick={() => window.location.reload()}
          variant="outline"
        >
          Go Back
        </Button>
        <Button 
          onClick={() => reset()}
          className="gap-2"
        >
          <RefreshCcw className="w-4 h-4" />
          Try again
        </Button>
      </div>
    </div>
  );
}
