import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { BASE_URL, API_TIMEOUT } from '../constants/api';

/**
 * RequestService - Central layer for all API communication
 * This service handles HTTP requests, authentication, and error handling
 */

// Create axios instance with default config
const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: API_TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Get authentication token from localStorage
 */
const getAuthToken = (): string | null => {
    return localStorage.getItem('token') || localStorage.getItem('authToken');
};

/**
 * Attach authentication headers to request
 */
const getAuthHeaders = (): Record<string, string> => {
    const token = getAuthToken();
    if (token) {
        return {
            Authorization: `Bearer ${token}`,
        };
    }
    return {};
};

/**
 * Generic error handler
 * Throws clear exceptions for non-200 status codes
 */
const handleResponse = <T>(response: AxiosResponse<T>): T => {
    if (response.status >= 200 && response.status < 300) {
        return response.data;
    }
    throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
};

/**
 * Generic GET request
 * @param endpoint - API endpoint (e.g., '/users', '/products')
 * @param config - Optional axios configuration
 */
export const get = async <T>(
    endpoint: string,
    config?: AxiosRequestConfig
): Promise<T> => {
    try {
        const response = await axiosInstance.get<T>(endpoint, {
            ...config,
            headers: {
                ...getAuthHeaders(),
                ...config?.headers,
            },
        });
        return handleResponse(response);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(
                error.response?.data?.message || error.message || 'GET request failed'
            );
        }
        throw error;
    }
};

/**
 * Generic POST request
 * @param endpoint - API endpoint
 * @param body - Request payload
 * @param config - Optional axios configuration
 */
export const post = async <T, D = any>(
    endpoint: string,
    body?: D,
    config?: AxiosRequestConfig
): Promise<T> => {
    try {
        const response = await axiosInstance.post<T>(endpoint, body, {
            ...config,
            headers: {
                ...getAuthHeaders(),
                ...config?.headers,
            },
        });
        return handleResponse(response);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(
                error.response?.data?.message || error.message || 'POST request failed'
            );
        }
        throw error;
    }
};

/**
 * Generic PUT request
 * @param endpoint - API endpoint
 * @param body - Request payload
 * @param config - Optional axios configuration
 */
export const put = async <T, D = any>(
    endpoint: string,
    body?: D,
    config?: AxiosRequestConfig
): Promise<T> => {
    try {
        const response = await axiosInstance.put<T>(endpoint, body, {
            ...config,
            headers: {
                ...getAuthHeaders(),
                ...config?.headers,
            },
        });
        return handleResponse(response);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(
                error.response?.data?.message || error.message || 'PUT request failed'
            );
        }
        throw error;
    }
};

/**
 * Generic DELETE request
 * @param endpoint - API endpoint
 * @param config - Optional axios configuration
 */
export const deleteRequest = async <T>(
    endpoint: string,
    config?: AxiosRequestConfig
): Promise<T> => {
    try {
        const response = await axiosInstance.delete<T>(endpoint, {
            ...config,
            headers: {
                ...getAuthHeaders(),
                ...config?.headers,
            },
        });
        return handleResponse(response);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(
                error.response?.data?.message || error.message || 'DELETE request failed'
            );
        }
        throw error;
    }
};

/**
 * Generic PATCH request
 * @param endpoint - API endpoint
 * @param body - Request payload
 * @param config - Optional axios configuration
 */
export const patch = async <T, D = any>(
    endpoint: string,
    body?: D,
    config?: AxiosRequestConfig
): Promise<T> => {
    try {
        const response = await axiosInstance.patch<T>(endpoint, body, {
            ...config,
            headers: {
                ...getAuthHeaders(),
                ...config?.headers,
            },
        });
        return handleResponse(response);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(
                error.response?.data?.message || error.message || 'PATCH request failed'
            );
        }
        throw error;
    }
};

// Export the axios instance for advanced usage if needed
export default axiosInstance;

