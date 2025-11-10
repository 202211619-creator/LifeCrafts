/**
 * AuthPayload - Interface for authentication request data
 * Used when sending login/register requests
 */

export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterPayload {
    email: string;
    password: string;
    username?: string;
    fullName?: string;
}

export interface ResetPasswordPayload {
    email: string;
}

export interface ChangePasswordPayload {
    oldPassword: string;
    newPassword: string;
}

