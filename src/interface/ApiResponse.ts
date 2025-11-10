/**
 * Generic API Response interfaces
 * Used for standardized API responses
 */

export interface ApiError {
    message: string;
    code?: string;
    statusCode?: number;
    details?: any;
}

export interface ApiSuccessResponse<T> {
    success: true;
    data: T;
    message?: string;
}

export interface ApiErrorResponse {
    success: false;
    error: ApiError;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

