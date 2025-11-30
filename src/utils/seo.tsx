/**
 * SEO Utilities
 * Functions for managing page metadata, titles, and descriptions
 */

export interface SEOData {
    title: string;
    description: string;
    keywords?: string[];
    ogImage?: string;
    ogType?: string;
    canonicalUrl?: string;
}

/**
 * Update page title and meta tags
 */
export function updateSEO(data: SEOData) {
    // Update document title
    document.title = `${data.title} | LifeCraft`;

    // Update or create meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', data.description);

    // Update or create meta keywords
    if (data.keywords && data.keywords.length > 0) {
        let metaKeywords = document.querySelector('meta[name="keywords"]');
        if (!metaKeywords) {
            metaKeywords = document.createElement('meta');
            metaKeywords.setAttribute('name', 'keywords');
            document.head.appendChild(metaKeywords);
        }
        metaKeywords.setAttribute('content', data.keywords.join(', '));
    }

    // Update Open Graph tags
    updateOGTag('og:title', data.title);
    updateOGTag('og:description', data.description);
    updateOGTag('og:type', data.ogType || 'website');
    if (data.ogImage) {
        updateOGTag('og:image', data.ogImage);
    }

    // Update canonical URL
    if (data.canonicalUrl) {
        let canonical = document.querySelector('link[rel="canonical"]');
        if (!canonical) {
            canonical = document.createElement('link');
            canonical.setAttribute('rel', 'canonical');
            document.head.appendChild(canonical);
        }
        canonical.setAttribute('href', data.canonicalUrl);
    }
}

function updateOGTag(property: string, content: string) {
    let meta = document.querySelector(`meta[property="${property}"]`);
    if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
}

// Import React for the hook
import React from 'react';

/**
 * Hook for updating SEO in components
 */
export function useSEO(data: SEOData) {
    React.useEffect(() => {
        updateSEO(data);
    }, [data.title, data.description]);
}

