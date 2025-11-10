import { useState } from 'react';
import { post } from '../services/RequestService';
import {
    LoginPayload,
    RegisterPayload,
    ResetPasswordPayload,
    AuthResponse,
    LogoutResponse,
    ResetPasswordResponse,
} from '../interface';

/**
 * useAuthRequest - Custom hook for authentication requests
 * This hook manages the state for authentication operations (login, register, etc.)
 */

interface UseAuthRequestReturn {
    // State
    data: AuthResponse | LogoutResponse | ResetPasswordResponse | null;
    isLoading: boolean;
    error: string | null;

    // Handler functions
    login: (credentials: LoginPayload) => Promise<void>;
    register: (credentials: RegisterPayload) => Promise<void>;
    logout: () => Promise<void>;
    resetPassword: (payload: ResetPasswordPayload) => Promise<void>;

    // Utility functions
    clearError: () => void;
    clearData: () => void;
}

export const useAuthRequest = (): UseAuthRequestReturn => {
    // State management using useState hook
    const [data, setData] = useState<AuthResponse | LogoutResponse | ResetPasswordResponse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Login handler
     * Calls the RequestService to authenticate user
     */
    const login = async (credentials: LoginPayload): Promise<void> => {
        setIsLoading(true);
        setError(null);
        setData(null);

        try {
            // Call the generic POST method from RequestService
            const response = await post<AuthResponse, LoginPayload>(
                '/auth/login',
                credentials
            );

            // Store token in localStorage
            if (response.token) {
                localStorage.setItem('token', response.token);
                localStorage.setItem('user', JSON.stringify(response.user));
            }

            // Transform data into component-friendly format
            setData(response);
        } catch (err) {
            // Handle error
            setError(err instanceof Error ? err.message : 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Register handler
     * Calls the RequestService to create a new user account
     */
    const register = async (credentials: RegisterPayload): Promise<void> => {
        setIsLoading(true);
        setError(null);
        setData(null);

        try {
            // Call the generic POST method from RequestService
            const response = await post<AuthResponse, RegisterPayload>(
                '/auth/register',
                credentials
            );

            // Store token in localStorage
            if (response.token) {
                localStorage.setItem('token', response.token);
                localStorage.setItem('user', JSON.stringify(response.user));
            }

            // Transform data into component-friendly format
            setData(response);
        } catch (err) {
            // Handle error
            setError(err instanceof Error ? err.message : 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Logout handler
     * Calls the RequestService to log out user
     */
    const logout = async (): Promise<void> => {
        setIsLoading(true);
        setError(null);
        setData(null);

        try {
            // Call the generic POST method from RequestService
            const response = await post<LogoutResponse>('/auth/logout');

            // Clear localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');

            setData(response);
        } catch (err) {
            // Handle error
            setError(err instanceof Error ? err.message : 'Logout failed');
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Reset Password handler
     * Calls the RequestService to send password reset email
     */
    const resetPassword = async (payload: ResetPasswordPayload): Promise<void> => {
        setIsLoading(true);
        setError(null);
        setData(null);

        try {
            // Call the generic POST method from RequestService
            const response = await post<ResetPasswordResponse, ResetPasswordPayload>(
                '/auth/reset-password',
                payload
            );

            setData(response);
        } catch (err) {
            // Handle error
            setError(err instanceof Error ? err.message : 'Password reset failed');
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Clear error state
     */
    const clearError = (): void => {
        setError(null);
    };

    /**
     * Clear data state
     */
    const clearData = (): void => {
        setData(null);
    };

    // Return interface with state and handler functions
    return {
        data,
        isLoading,
        error,
        login,
        register,
        logout,
        resetPassword,
        clearError,
        clearData,
    };
};

