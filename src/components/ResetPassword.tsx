import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Lock, Leaf, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { supabase } from '../utils/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner@2.0.3';

export function ResetPassword() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [hasValidSession, setHasValidSession] = useState(false);

  useEffect(() => {
    // Handle the auth callback from the email link
    const handleAuthCallback = async () => {
      try {
        // Check for error in URL hash first
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const errorParam = hashParams.get('error');
        const errorCode = hashParams.get('error_code');
        const errorDescription = hashParams.get('error_description');

        console.log('Current session:', await supabase.auth.getSession());
        console.log('URL hash:', window.location.hash);
        console.log('Hash params:', { errorParam, errorCode, errorDescription });

        // Handle errors from Supabase
        if (errorParam) {
          if (errorCode === 'otp_expired') {
            setError('This password reset link has expired. Password reset links are valid for 1 hour. Please request a new one.');
          } else {
            setError(errorDescription ? decodeURIComponent(errorDescription.replace(/\+/g, ' ')) : 'An error occurred with the reset link.');
          }
          setHasValidSession(false);
          setVerifying(false);
          return;
        }

        // Check if there's already a valid session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (session) {
          // We have a valid session
          setHasValidSession(true);
          toast.success('Verified! Please enter your new password.');
          setVerifying(false);
          return;
        }

        // If no session, try to handle the hash manually
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const type = hashParams.get('type');

        console.log('Token check:', { accessToken: !!accessToken, refreshToken: !!refreshToken, type });

        if (type === 'recovery' && accessToken && refreshToken) {
          // Set the session with both tokens
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            console.error('Session error:', error);
            setError(`Session error: ${error.message}`);
            setHasValidSession(false);
          } else if (data.session) {
            setHasValidSession(true);
            toast.success('Verified! Please enter your new password.');
          } else {
            setError('Could not create session. Please request a new password reset.');
            setHasValidSession(false);
          }
        } else if (!errorParam) {
          // No error, but also no valid tokens
          setError('Invalid reset link. Please request a new password reset.');
          setHasValidSession(false);
        }
      } catch (err) {
        console.error('Auth callback error:', err);
        setError(`An error occurred: ${err instanceof Error ? err.message : 'Unknown error'}`);
        setHasValidSession(false);
      } finally {
        setVerifying(false);
      }
    };

    handleAuthCallback();
  }, []);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (!password || !confirmPassword) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        setError(error.message);
        toast.error(error.message);
      } else {
        setSuccess(true);
        toast.success('Password reset successful!');
        // Redirect to home/dashboard after 2 seconds
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    } catch (err) {
      console.error('Reset password error:', err);
      setError('An unexpected error occurred');
      toast.error('An unexpected error occurred');
    }

    setLoading(false);
  };

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="w-12 h-12 text-green-600 animate-spin mb-4" />
              <p className="text-muted-foreground">Verifying your reset link...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!hasValidSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-green-700">LifeCraft</h1>
                <p className="text-sm text-muted-foreground">Off-grid living & survival</p>
              </div>
            </div>
            <CardTitle className="mt-4">Reset Link Issue</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Button
                className="w-full"
                onClick={() => navigate('/')}
              >
                Request New Reset Link
              </Button>
              
              <p className="text-xs text-center text-muted-foreground">
                You'll be taken to the sign-in page where you can click "Forgot password?" to get a new link.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-green-700">LifeCraft</h1>
              <p className="text-sm text-muted-foreground">Off-grid living & survival</p>
            </div>
          </div>
          <CardTitle className="mt-4">Set New Password</CardTitle>
          <CardDescription>
            Enter your new password below
          </CardDescription>
        </CardHeader>

        <CardContent>
          {success ? (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">
                Password reset successful! Redirecting you to the app...
              </AlertDescription>
            </Alert>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="Enter new password"
                    className="pl-9"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-new-password">Confirm New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirm-new-password"
                    type="password"
                    placeholder="Confirm new password"
                    className="pl-9"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Resetting Password...
                  </>
                ) : (
                  'Reset Password'
                )}
              </Button>

              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => navigate('/')}
                disabled={loading}
              >
                Back to Sign In
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}