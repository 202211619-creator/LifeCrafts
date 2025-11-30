/**
 * Suspense Fallback Component
 * Loading component for lazy-loaded routes
 */

import { Loader2 } from 'lucide-react';

export function SuspenseFallback() {
    return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">Loading...</p>
            </div>
        </div>
    );
}

