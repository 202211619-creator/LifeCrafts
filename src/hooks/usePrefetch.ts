/**
 * Prefetch Hook for Data Fetching Optimization
 * Implements prefetching strategy similar to Next.js prefetching
 */

import { useQueryClient } from '@tanstack/react-query';
import { useProfile, usePosts, useSurvivalGuides } from './useQuery';

/**
 * Prefetch data before it's needed
 * Useful for optimizing page transitions
 */
export function usePrefetch() {
    const queryClient = useQueryClient();

    const prefetchProfile = () => {
        queryClient.prefetchQuery({
            queryKey: ['profile'],
            queryFn: async () => {
                const { useProfile } = await import('./useQuery');
                // This would need to be refactored to work with prefetch
                return null;
            },
        });
    };

    const prefetchPosts = () => {
        queryClient.prefetchQuery({
            queryKey: ['posts'],
        });
    };

    const prefetchSurvivalGuides = () => {
        queryClient.prefetchQuery({
            queryKey: ['survival-guides'],
        });
    };

    return {
        prefetchProfile,
        prefetchPosts,
        prefetchSurvivalGuides,
    };
}

/**
 * Prefetch on hover or link focus
 */
export function useLinkPrefetch() {
    const queryClient = useQueryClient();

    const prefetchOnHover = (queryKey: string[], queryFn: () => Promise<any>) => {
        return {
            onMouseEnter: () => {
                queryClient.prefetchQuery({
                    queryKey,
                    queryFn,
                    staleTime: 5 * 60 * 1000, // 5 minutes
                });
            },
        };
    };

    return { prefetchOnHover };
}

