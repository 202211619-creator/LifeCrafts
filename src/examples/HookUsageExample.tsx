/**
 * ============================================
 * ACTIVITY #5 - COMPLETE USAGE EXAMPLE
 * ============================================
 * 
 * This file demonstrates the complete pattern for
 * implementing the Data Fetching Service & Hook
 */

import React, { useEffect } from 'react';
import { useAuthRequest } from '../hooks/useAuthRequest';
import { LoginPayload } from '../interface';

// ============================================
// EXAMPLE 1: Basic Login Component
// ============================================
export const BasicLoginExample = () => {
    // Step 1: Import and use the custom hook
    const { login, data, isLoading, error } = useAuthRequest();

    // Step 2: Create handler function
    const handleLogin = async () => {
        const credentials: LoginPayload = {
            email: 'user@example.com',
            password: 'password123'
        };

        // Step 3: Trigger the request
        await login(credentials);
    };

    // Step 4: Handle response
    useEffect(() => {
        if (data && 'user' in data) {
            console.log('Login successful:', data);
            // Do something with the user data
        }
    }, [data]);

    // Step 5: Display status in UI
    return (
        <div>
            <button onClick={handleLogin} disabled={isLoading}>
                {isLoading ? 'Loading...' : 'Login'}
            </button>
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            {data && <p style={{ color: 'green' }}>Success!</p>}
        </div>
    );
};

// ============================================
// EXAMPLE 2: Component with Form
// ============================================
export const FormLoginExample = () => {
    const { login, isLoading, error, clearError } = useAuthRequest();
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        clearError(); // Clear previous errors

        await login({ email, password });
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
            />
            <button type="submit" disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Login'}
            </button>
            {error && <div className="error">{error}</div>}
        </form>
    );
};

// ============================================
// EXAMPLE 3: Registration Component
// ============================================
export const RegisterExample = () => {
    const { register, data, isLoading, error } = useAuthRequest();

    const handleRegister = async () => {
        await register({
            email: 'newuser@example.com',
            password: 'securepassword',
            username: 'newuser',
            fullName: 'New User'
        });
    };

    useEffect(() => {
        if (data && 'user' in data) {
            console.log('Registration successful!');
            // Redirect to dashboard or show success message
        }
    }, [data]);

    return (
        <div>
            <button onClick={handleRegister} disabled={isLoading}>
                {isLoading ? 'Creating account...' : 'Register'}
            </button>
            {isLoading && <div className="spinner">Loading...</div>}
            {error && <div className="error">{error}</div>}
        </div>
    );
};

// ============================================
// EXAMPLE 4: Logout Component
// ============================================
export const LogoutExample = () => {
    const { logout, isLoading } = useAuthRequest();

    const handleLogout = async () => {
        await logout();
        // User will be logged out and localStorage cleared
        console.log('User logged out');
    };

    return (
        <button onClick={handleLogout} disabled={isLoading}>
            {isLoading ? 'Logging out...' : 'Logout'}
        </button>
    );
};

// ============================================
// KEY POINTS:
// ============================================
//
// 1. ✅ Components NEVER use fetch() directly
// 2. ✅ Components NEVER import axios directly
// 3. ✅ Components only use custom hooks (useAuthRequest)
// 4. ✅ Hooks call the RequestService
// 5. ✅ RequestService handles all HTTP logic
// 6. ✅ State management is handled by hooks (useState)
// 7. ✅ Authentication tokens are managed automatically
// 8. ✅ Error handling is centralized
//
// ============================================
// ARCHITECTURE FLOW:
// ============================================
//
// Component → Hook → RequestService → API
//    ↓         ↓          ↓
//   UI     useState    axios
//  State   Manager   HTTP Client
//
// ============================================

