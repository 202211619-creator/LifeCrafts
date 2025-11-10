import React, { useState, useEffect } from 'react';
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    LogIn,
    BookOpen,
    Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

// ============================================
// PHASE 4: Using the Hook in a Component
// ============================================

// Step 1: Import the custom hook
import { useAuthRequest } from '../hooks/useAuthRequest';
import { LoginPayload } from '../interface';

interface LoginWithHookProps {
    onLogin: (userData: any) => void;
}

export function LoginWithHook({ onLogin }: LoginWithHookProps) {
    // ============================================
    // Step 2: Use the custom hook to get state and handler functions
    // ============================================
    const { login, data, isLoading, error, clearError } = useAuthRequest();

    // Local form state
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState<LoginPayload>({
        email: '',
        password: ''
    });

    // ============================================
    // Step 3: Handle success - when data is received
    // ============================================
    useEffect(() => {
        if (data && 'user' in data) {
            toast.success('Welcome back to LifeCraft!');
            onLogin(data.user);
        }
    }, [data, onLogin]);

    // ============================================
    // Step 4: Handle errors - display error messages
    // ============================================
    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    // ============================================
    // Step 5: Trigger Request - Call handler function on form submit
    // ============================================
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Clear any previous errors
        clearError();

        // Basic validation
        if (!formData.email || !formData.password) {
            toast.error('Please fill in all fields');
            return;
        }

        // Call the login handler from the hook
        // This will trigger the request via RequestService
        await login(formData);
    };

    // ============================================
    // Step 6: Display Status - Use state variables to update UI
    // ============================================
    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-6">
                {/* Logo */}
                <div className="text-center space-y-2">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary via-primary/80 to-primary/60 rounded-xl flex items-center justify-center">
                        <BookOpen className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Welcome to LifeCraft</h1>
                        <p className="text-muted-foreground">Data Fetching Service Implementation</p>
                    </div>
                </div>

                <Card>
                    <form onSubmit={handleSubmit}>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <LogIn className="w-5 h-5" />
                                Sign In with Custom Hook
                            </CardTitle>
                            <CardDescription>
                                This component uses the useAuthRequest hook
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            {/* Error Alert - Display when error state exists */}
                            {error && (
                                <Alert variant="destructive">
                                    <AlertTriangle className="h-4 w-4" />
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            {/* Success Alert - Display when data is received */}
                            {data && (
                                <Alert className="border-green-500 text-green-700">
                                    <CheckCircle2 className="h-4 w-4" />
                                    <AlertDescription>Login successful!</AlertDescription>
                                </Alert>
                            )}

                            {/* Email Input */}
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        className="pl-10"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        disabled={isLoading}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password Input */}
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        className="pl-10 pr-10"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        disabled={isLoading}
                                        required
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                                        onClick={() => setShowPassword(!showPassword)}
                                        disabled={isLoading}
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </Button>
                                </div>
                            </div>

                            {/* Status Indicator - Show spinner when isLoading is true */}
                            {isLoading && (
                                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Authenticating...</span>
                                </div>
                            )}
                        </CardContent>

                        <CardFooter>
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Signing In...
                                    </>
                                ) : (
                                    'Sign In'
                                )}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>

                {/* Implementation Notes */}
                <div className="bg-muted/50 border border-border rounded-lg p-4">
                    <div className="text-sm font-medium mb-2">🎯 Implementation Summary:</div>
                    <div className="space-y-1 text-xs text-muted-foreground">
                        <div>✅ Step 1: Import custom hook (useAuthRequest)</div>
                        <div>✅ Step 2: Destructure state and functions from hook</div>
                        <div>✅ Step 3: Trigger request with login(formData)</div>
                        <div>✅ Step 4: Display spinner when isLoading is true</div>
                        <div>✅ Step 5: Display error when error exists</div>
                        <div>✅ Step 6: Handle success when data is received</div>
                    </div>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                    <p>🔧 This component demonstrates Activity #5 implementation</p>
                </div>
            </div>
        </div>
    );
}

