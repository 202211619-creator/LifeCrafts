/**
 * Configuration utilities for the LifeCraft app
 * Handles environment variables and API endpoints in a browser-safe way
 */

import { projectId, publicAnonKey } from './supabase/info';

/**
 * Application configuration
 * All environment-dependent values should be accessed through this object
 */
export const config = {
  // Supabase configuration
  supabase: {
    url: `https://${projectId}.supabase.co`,
    anonKey: publicAnonKey,
    projectId: projectId
  },
  
  // API endpoints
  api: {
    baseUrl: `https://${projectId}.supabase.co/functions/v1/make-server-3aae099d`,
    
    // Emergency endpoints
    emergencyAlerts: '/emergency/alerts',
    callLog: '/emergency/call-log',
    
    // Family tracking endpoints
    locationUpdate: '/location/update',
    familyCheckin: '/family/checkin',
    familyStatus: '/family/:id/status',
    
    // AI assistant endpoints
    aiChat: '/ai/chat',
    
    // Auth endpoints
    signup: '/auth/signup',
    profile: '/profile',
    
    // Content endpoints
    posts: '/posts',
    downloads: '/downloads',
    survivalGuides: '/survival-guides',
    downloadGuide: '/download-guide/:id',
    
    // Utility endpoints
    health: '/health',
    reportBug: '/report-bug'
  },
  
  // App settings
  app: {
    name: 'LifeCraft',
    version: '1.0.0',
    description: 'Off-grid Living & Emergency Preparedness Ecosystem'
  },
  
  // Emergency settings
  emergency: {
    alertRefreshInterval: 5 * 60 * 1000, // 5 minutes
    locationUpdateInterval: 30 * 1000,   // 30 seconds
    familyCheckinTimeout: 12 * 60 * 60 * 1000, // 12 hours
    maxOfflineAlerts: 50
  },
  
  // Feature flags
  features: {
    webScraping: true,
    aiAssistant: true,
    familyTracking: true,
    offlineMode: true,
    emergencyMode: true,
    voiceCommands: false // Future feature
  }
};

/**
 * Get a full API URL for a given endpoint
 * @param endpoint - The endpoint path (with or without leading slash)
 * @param params - Optional parameters to replace in the URL (e.g., {id: '123'})
 * @returns Complete URL string
 */
export function getApiUrl(endpoint: string, params?: Record<string, string>): string {
  let url = endpoint.startsWith('/') 
    ? `${config.api.baseUrl}${endpoint}`
    : `${config.api.baseUrl}/${endpoint}`;
    
  // Replace path parameters
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url = url.replace(`:${key}`, value);
    }
  }
  
  return url;
}

/**
 * Get authentication headers for API requests
 * @param accessToken - Optional access token (will use anon key if not provided)
 * @returns Headers object for fetch requests
 */
export function getAuthHeaders(accessToken?: string): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken || config.supabase.anonKey}`
  };
}

/**
 * Check if we're running in development mode
 * @returns True if in development
 */
export function isDevelopment(): boolean {
  return window.location.hostname === 'localhost' || 
         window.location.hostname === '127.0.0.1' ||
         window.location.hostname.includes('preview');
}

/**
 * Get the current environment name
 * @returns Environment string
 */
export function getEnvironment(): 'development' | 'staging' | 'production' {
  if (isDevelopment()) return 'development';
  if (window.location.hostname.includes('staging')) return 'staging';
  return 'production';
}

/**
 * Log configuration information (only in development)
 */
export function logConfig(): void {
  if (isDevelopment()) {
    console.log('LifeCraft Configuration:', {
      environment: getEnvironment(),
      supabaseUrl: config.supabase.url,
      projectId: config.supabase.projectId,
      features: config.features
    });
  }
}

// Initialize configuration logging in development
if (isDevelopment()) {
  logConfig();
}