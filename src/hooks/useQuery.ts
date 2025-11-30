/**
 * Custom Query Hooks
 * Reusable hooks following standard interface/data contract
 * Using React Query for data fetching and caching
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { supabase } from '../utils/supabase/client';
import { getApiUrl, getAuthHeaders } from '../utils/config';
import type {
    ApiResponse,
    UserProfile,
    UpdateProfileRequest,
    Post,
    CreatePostRequest,
    UpdatePostRequest,
    EmergencyAlert,
    SurvivalGuide,
    AIChatRequest,
    AIChatResponse,
    Notification
} from '../interface/api.types';

// ==================== Standard Query Hook Interface ====================

export interface QueryHookResult<T> {
    data: T | undefined;
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
    refetch: () => void;
}

export interface MutationHookResult<TData, TVariables> {
    mutate: (variables: TVariables) => void;
    mutateAsync: (variables: TVariables) => Promise<TData>;
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
    isSuccess: boolean;
}

// ==================== Helper Functions ====================

async function getAuthToken(): Promise<string | null> {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || null;
}

async function apiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<ApiResponse<T>> {
    const token = await getAuthToken();
    const url = getApiUrl(endpoint);
    const headers = {
        ...getAuthHeaders(token || undefined),
        ...options.headers,
    };

    const response = await fetch(url, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Request failed' }));
        throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
}

// ==================== User & Profile Hooks ====================

export function useProfile() {
    return useQuery<UserProfile>({
        queryKey: ['profile'],
        queryFn: async () => {
            const response = await apiRequest<UserProfile>('/profile');
            if (!response.success || !response.data) {
                throw new Error(response.error || 'Failed to fetch profile');
            }
            return response.data;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes - Optimized for SSG-like behavior
        cacheTime: 10 * 60 * 1000, // 10 minutes cache
        retry: 1,
        refetchOnWindowFocus: false, // Optimize: don't refetch on window focus
    });
}

export function useUpdateProfile() {
    const queryClient = useQueryClient();

    return useMutation<UserProfile, Error, UpdateProfileRequest>({
        mutationFn: async (data) => {
            const response = await apiRequest<UserProfile>('/profile', {
                method: 'PUT',
                body: JSON.stringify(data),
            });
            if (!response.success || !response.data) {
                throw new Error(response.error || 'Failed to update profile');
            }
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profile'] });
        },
    });
}

// ==================== Community & Posts Hooks ====================

export function usePosts() {
    return useQuery<Post[]>({
        queryKey: ['posts'],
        queryFn: async () => {
            const response = await apiRequest<Post[]>('/posts');
            if (!response.success || !response.data) {
                throw new Error(response.error || 'Failed to fetch posts');
            }
            return Array.isArray(response.data) ? response.data : [];
        },
        staleTime: 2 * 60 * 1000, // 2 minutes - Optimized for ISR-like behavior
        cacheTime: 5 * 60 * 1000, // 5 minutes cache
        retry: 1,
        refetchOnWindowFocus: false, // Optimize: don't refetch on window focus
    });
}

export function usePost(postId: number) {
    return useQuery<Post>({
        queryKey: ['posts', postId],
        queryFn: async () => {
            const response = await apiRequest<Post>(`/posts/${postId}`);
            if (!response.success || !response.data) {
                throw new Error(response.error || 'Failed to fetch post');
            }
            return response.data;
        },
        enabled: !!postId,
        staleTime: 2 * 60 * 1000,
        retry: 1,
    });
}

export function useCreatePost() {
    const queryClient = useQueryClient();

    return useMutation<Post, Error, CreatePostRequest>({
        mutationFn: async (data) => {
            const formData = new FormData();
            formData.append('title', data.title);
            formData.append('description', data.description);
            formData.append('category', data.category);
            if (data.content) formData.append('content', data.content);
            if (data.file) formData.append('file', data.file);

            const token = await getAuthToken();
            const url = getApiUrl('/posts');
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token || ''}`,
                },
                body: formData,
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({ message: 'Failed to create post' }));
                throw new Error(error.message || 'Failed to create post');
            }

            const result = await response.json();
            if (!result.success || !result.data) {
                throw new Error(result.error || 'Failed to create post');
            }
            return result.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        },
    });
}

export function useUpdatePost() {
    const queryClient = useQueryClient();

    return useMutation<Post, Error, { id: number; data: UpdatePostRequest }>({
        mutationFn: async ({ id, data }) => {
            const response = await apiRequest<Post>(`/posts/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data),
            });
            if (!response.success || !response.data) {
                throw new Error(response.error || 'Failed to update post');
            }
            return response.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            queryClient.invalidateQueries({ queryKey: ['posts', variables.id] });
        },
    });
}

export function useDeletePost() {
    const queryClient = useQueryClient();

    return useMutation<void, Error, number>({
        mutationFn: async (postId) => {
            const response = await apiRequest<void>(`/posts/${postId}`, {
                method: 'DELETE',
            });
            if (!response.success) {
                throw new Error(response.error || 'Failed to delete post');
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        },
    });
}

export function useLikePost() {
    const queryClient = useQueryClient();

    return useMutation<Post, Error, number>({
        mutationFn: async (postId) => {
            const response = await apiRequest<Post>(`/posts/${postId}/like`, {
                method: 'POST',
            });
            if (!response.success || !response.data) {
                throw new Error(response.error || 'Failed to like post');
            }
            return response.data;
        },
        onSuccess: (_, postId) => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            queryClient.invalidateQueries({ queryKey: ['posts', postId] });
        },
    });
}

// ==================== Emergency Hooks ====================

export function useEmergencyAlerts() {
    return useQuery<EmergencyAlert[]>({
        queryKey: ['emergency-alerts'],
        queryFn: async () => {
            const response = await apiRequest<EmergencyAlert[]>('/emergency/alerts');
            if (!response.success || !response.data) {
                throw new Error(response.error || 'Failed to fetch emergency alerts');
            }
            return Array.isArray(response.data) ? response.data : [];
        },
        staleTime: 1 * 60 * 1000, // 1 minute
        refetchInterval: 2 * 60 * 1000, // Refetch every 2 minutes
        retry: 1,
    });
}

// ==================== Knowledge Hub Hooks ====================

export function useSurvivalGuides() {
    return useQuery<SurvivalGuide[]>({
        queryKey: ['survival-guides'],
        queryFn: async () => {
            const response = await apiRequest<SurvivalGuide[]>('/survival-guides');
            if (!response.success || !response.data) {
                throw new Error(response.error || 'Failed to fetch survival guides');
            }
            return Array.isArray(response.data) ? response.data : [];
        },
        staleTime: 10 * 60 * 1000, // 10 minutes
        retry: 1,
    });
}

export function useDownloadGuide() {
    const queryClient = useQueryClient();

    return useMutation<void, Error, string>({
        mutationFn: async (guideId) => {
            const response = await apiRequest<void>(`/download-guide/${guideId}`, {
                method: 'POST',
            });
            if (!response.success) {
                throw new Error(response.error || 'Failed to download guide');
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['survival-guides'] });
        },
    });
}

// ==================== AI Hub Hooks ====================

export function useAIChat() {
    const queryClient = useQueryClient();

    return useMutation<AIChatResponse, Error, AIChatRequest>({
        mutationFn: async (data) => {
            const response = await apiRequest<AIChatResponse>('/ai/chat', {
                method: 'POST',
                body: JSON.stringify(data),
            });
            if (!response.success || !response.data) {
                throw new Error(response.error || 'Failed to send message');
            }
            return response.data;
        },
    });
}

// ==================== Notification Hooks ====================

export function useNotifications() {
    return useQuery<Notification[]>({
        queryKey: ['notifications'],
        queryFn: async () => {
            // This would typically come from an API endpoint
            // For now, returning empty array as placeholder
            return [];
        },
        staleTime: 30 * 1000, // 30 seconds
        refetchInterval: 60 * 1000, // Refetch every minute
        retry: 1,
    });
}

