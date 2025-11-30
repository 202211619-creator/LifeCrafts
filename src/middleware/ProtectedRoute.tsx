/**
 * Protected Route Middleware Component
 * Implements route protection logic similar to Next.js middleware
 * Handles authentication checks and redirects
 */

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAuth?: boolean;
    redirectTo?: string;
    allowedRoles?: string[];
}

export function ProtectedRoute({
    children,
    requireAuth = true,
    redirectTo = '/login',
    allowedRoles,
}: ProtectedRouteProps) {
    const { user, loading } = useAuth();
    const location = useLocation();

    // Show loading state while checking auth
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    // If auth is required but user is not authenticated
    if (requireAuth && !user) {
        // Save the attempted location for redirect after login
        return <Navigate to={redirectTo} state={{ from: location }} replace />;
    }

    // If user is authenticated but trying to access login page, redirect to dashboard
    if (!requireAuth && user && location.pathname === '/login') {
        return <Navigate to="/" replace />;
    }

    // Check role-based access if roles are specified
    if (allowedRoles && user) {
        // For now, we'll check if user has required role
        // You can extend this based on your user role system
        const userRole = (user as any).role || 'user';
        if (!allowedRoles.includes(userRole)) {
            return <Navigate to="/unauthorized" replace />;
        }
    }

    return <>{children}</>;
}

