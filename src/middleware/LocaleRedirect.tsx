/**
 * Locale Redirect Middleware
 * Handles locale-based redirects similar to Next.js middleware
 */

import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface LocaleRedirectProps {
    children: React.ReactNode;
    defaultLocale?: string;
    supportedLocales?: string[];
}

export function LocaleRedirect({
    children,
    defaultLocale = 'en',
    supportedLocales = ['en'],
}: LocaleRedirectProps) {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const pathname = location.pathname;
        const pathSegments = pathname.split('/').filter(Boolean);

        // Check if first segment is a locale
        const firstSegment = pathSegments[0];
        const isLocale = supportedLocales.includes(firstSegment);

        // If no locale in path, redirect to default locale
        if (!isLocale && pathSegments.length > 0) {
            const newPath = `/${defaultLocale}${pathname}`;
            navigate(newPath, { replace: true });
        }
    }, [location.pathname, defaultLocale, supportedLocales, navigate]);

    return <>{children}</>;
}

