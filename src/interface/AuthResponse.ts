/**
 * AuthResponse - Interface for authentication response data
 * Used when receiving data from login/register endpoints
 */

export interface User {
    id: string;
    email: string;
    username?: string;
    fullName?: string;
    avatar?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface AuthResponse {
    user: User;
    token: string;
    refreshToken?: string;
    expiresIn?: number;
    message?: string;
}

export interface LogoutResponse {
    success: boolean;
    message: string;
}

export interface ResetPasswordResponse {
    success: boolean;
    message: string;
}

