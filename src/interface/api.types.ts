/**
 * API Data Contracts and Type Definitions
 * Standard interfaces for all API requests and responses
 */

// ==================== Common Types ====================

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface ApiError {
    message: string;
    code?: string;
    status?: number;
}

// ==================== User & Auth Types ====================

export interface User {
    id: string;
    email: string;
    name: string;
    avatar_url?: string;
    provider?: string;
}

export interface UserProfile {
    id: string;
    email: string;
    name: string;
    avatar_url?: string;
    age?: number;
    birthdate?: string;
    gender?: string;
    phone_number?: string;
    level: number;
    points: number;
    location_sharing_enabled: boolean;
    created_at: string;
    stats: {
        posts_created: number;
        guides_downloaded: number;
        contributions: number;
    };
}

export interface UpdateProfileRequest {
    name?: string;
    email?: string;
    age?: number;
    birthdate?: string;
    gender?: string;
    phone_number?: string;
}

// ==================== Community & Posts Types ====================

export interface Comment {
    id: number;
    author: {
        name: string;
        avatar: string;
        level: number;
    };
    content: string;
    timeAgo: string;
    likes: number;
    isLiked: boolean;
    replies?: Comment[];
}

export interface Post {
    id: number;
    user_id?: string;
    author: {
        name: string;
        avatar: string;
        badge: string;
        level: number;
        user_id?: string;
    };
    title: string;
    description: string;
    content?: string;
    image?: string;
    fileUrl?: string;
    fileType?: 'pdf' | 'mp4' | 'image';
    fileName?: string;
    likes: number;
    comments: Comment[];
    rating: number;
    category: string;
    timeAgo: string;
    isLiked: boolean;
    views: number;
    downloads: number;
    created_at?: string;
}

export interface CreatePostRequest {
    title: string;
    description: string;
    content?: string;
    category: string;
    file?: File;
}

export interface UpdatePostRequest {
    title?: string;
    description?: string;
    content?: string;
    category?: string;
}

// ==================== Emergency Types ====================

export interface EmergencyAlert {
    id: string;
    type: 'emergency' | 'family' | 'community' | 'system';
    title: string;
    message: string;
    time: string;
    read: boolean;
    priority: 'low' | 'medium' | 'high' | 'critical';
    source?: string;
    actionRequired?: boolean;
}

export interface EmergencyReport {
    id: string;
    type: string;
    category: string;
    status: string;
    location?: {
        name: string;
    };
    description?: string;
    updated_at?: string;
    created_at?: string;
}

// ==================== Knowledge Hub Types ====================

export interface SurvivalGuide {
    id: string;
    title: string;
    description: string;
    category: string;
    content?: string;
    image?: string;
    fileUrl?: string;
    fileName?: string;
    fileSize?: number;
    downloads: number;
    rating: number;
    created_at?: string;
}

export interface DownloadGuideRequest {
    guideId: string;
}

// ==================== AI Hub Types ====================

export interface AIChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
}

export interface AIChatRequest {
    message: string;
    conversationId?: string;
}

export interface AIChatResponse {
    message: string;
    conversationId: string;
}

// ==================== Location & Tracking Types ====================

export interface LocationUpdate {
    latitude: number;
    longitude: number;
    timestamp: string;
}

export interface FamilyMember {
    id: string;
    name: string;
    status: 'safe' | 'check-in-required' | 'unknown';
    lastCheckIn?: string;
    location?: LocationUpdate;
}

// ==================== Notification Types ====================

export interface Notification {
    id: string | number;
    type: 'emergency' | 'family' | 'community' | 'system';
    title: string;
    message: string;
    time: string;
    read: boolean;
    priority: 'low' | 'medium' | 'high' | 'critical';
    source?: string;
    actionRequired?: boolean;
}

