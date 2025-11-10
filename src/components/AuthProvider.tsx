import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner@2.0.3';
import { supabase } from '../utils/supabase/client';
import { getApiUrl, getAuthHeaders } from '../utils/config';

interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  provider?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (updates: Partial<User>) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata?.name || session.user.email!,
          avatar_url: session.user.user_metadata?.avatar_url,
          provider: session.user.app_metadata?.provider
        });
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata?.name || session.user.email!,
          avatar_url: session.user.user_metadata?.avatar_url,
          provider: session.user.app_metadata?.provider
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      toast.success('Successfully signed in!');
      return { success: true };
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      // Use Supabase auth directly instead of server endpoint
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          },
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      // Check if email confirmation is required
      if (data?.user && !data.session) {
        toast.success('Account created! Please check your email to verify your account.');
        return { success: true };
      }

      // If session exists, user is logged in automatically
      if (data?.session) {
        toast.success('Account created successfully!');
        return { success: true };
      }

      return { success: true };
    } catch (error) {
      console.error('Sign up error:', error);
      return { success: false, error: 'An unexpected error occurred. Please try again.' };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Signed out successfully');
      }
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Error signing out');
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      toast.success('Password reset email sent! Check your inbox.');
      return { success: true };
    } catch (error) {
      console.error('Reset password error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    try {
      if (!user) {
        return { success: false, error: 'No user logged in' };
      }

      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.access_token) {
        return { success: false, error: 'No valid session' };
      }

      const response = await fetch(getApiUrl('/profile'), {
        method: 'PUT',
        headers: getAuthHeaders(session.session.access_token),
        body: JSON.stringify(updates),
      });

      const result = await response.json();

      if (!response.ok) {
        return { success: false, error: result.error };
      }

      // Update local user state
      setUser(prev => prev ? { ...prev, ...updates } : null);
      toast.success('Profile updated successfully!');

      return { success: true };
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}