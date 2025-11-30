/**
 * Lazy-loaded page components
 * Implements React lazy loading for code splitting
 */

import { lazy } from 'react';

// Lazy load page components for code splitting
export const CommunityPage = lazy(() =>
    import('./CommunityPage').then(module => ({ default: module.CommunityPage }))
);

export const ProfilePage = lazy(() =>
    import('./ProfilePage').then(module => ({ default: module.ProfilePage }))
);

// Lazy load other pages
export const KnowledgeHub = lazy(() =>
    import('../KnowledgeHub').then(module => ({ default: module.KnowledgeHub }))
);

export const ToolsCalculators = lazy(() =>
    import('../ToolsCalculators').then(module => ({ default: module.ToolsCalculators }))
);

export const EmergencyPreparedness = lazy(() =>
    import('../EmergencyPreparedness').then(module => ({ default: module.EmergencyPreparedness }))
);

export const AIHub = lazy(() =>
    import('../AIHub').then(module => ({ default: module.AIHub }))
);

export const OfflineManager = lazy(() =>
    import('../OfflineManager').then(module => ({ default: module.OfflineManager }))
);

