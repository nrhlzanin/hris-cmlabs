/**
 * React hook for session management
 * Provides session state and automatic logout functionality
 */

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { sessionManager } from '@/utils/sessionManager';
import { authService } from '@/services/authService';

interface UseSessionOptions {
  redirectOnExpiry?: boolean;
  redirectPath?: string;
  showWarningDialog?: boolean;
  warningThreshold?: number; // in milliseconds
}

interface SessionState {
  isActive: boolean;
  timeRemaining: number;
  showWarning: boolean;
  isExpired: boolean;
}

interface UseSessionReturn {
  sessionState: SessionState;
  extendSession: () => void;
  logout: () => Promise<void>;
  formatTimeRemaining: () => string;
}

export function useSession(options: UseSessionOptions = {}): UseSessionReturn {
  const {
    redirectOnExpiry = true,
    redirectPath = '/login',
    showWarningDialog = true,
    warningThreshold = 5 * 60 * 1000, // 5 minutes
  } = options;

  const router = useRouter();
  const [sessionState, setSessionState] = useState<SessionState>({
    isActive: false,
    timeRemaining: 0,
    showWarning: false,
    isExpired: false,
  });

  const updateSessionState = useCallback(() => {
    const isValid = sessionManager.isSessionValid();
    const timeLeft = sessionManager.getTimeRemaining();
    
    setSessionState(prev => ({
      ...prev,
      isActive: isValid,
      timeRemaining: timeLeft,
      showWarning: showWarningDialog && timeLeft > 0 && timeLeft <= warningThreshold,
      isExpired: !isValid && prev.isActive, // Only set expired if was previously active
    }));
  }, [showWarningDialog, warningThreshold]);

  const handleSessionExpired = useCallback(async () => {
    console.log('Session expired, logging out...');
    
    try {
      // Clear authentication data
      authService.removeToken();
      
      // Update state
      setSessionState({
        isActive: false,
        timeRemaining: 0,
        showWarning: false,
        isExpired: true,
      });

      // Redirect to login if enabled
      if (redirectOnExpiry) {
        router.push(redirectPath);
      }
    } catch (error) {
      console.error('Error during session expiry handling:', error);
    }
  }, [redirectOnExpiry, redirectPath, router]);
  const handleSessionWarning = useCallback((timeLeft: number) => {
    console.log('Session warning:', timeLeft);
    updateSessionState();
  }, [updateSessionState]);

  const handleTokenRefresh = useCallback(async (): Promise<boolean> => {
    try {
      console.log('Attempting to refresh token...');
      const response = await authService.refreshToken();
      if (response.success && response.data) {
        // Update session with new token
        sessionManager.createSession(response.data.token, response.data.user.id);
        console.log('Token refreshed successfully');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  }, []);

  const extendSession = useCallback(() => {
    sessionManager.extendSession();
    updateSessionState();
  }, [updateSessionState]);

  const logout = useCallback(async () => {
    try {
      // Call API logout
      await authService.logout();
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      // Destroy session manager
      sessionManager.destroy();
      
      // Update state
      setSessionState({
        isActive: false,
        timeRemaining: 0,
        showWarning: false,
        isExpired: false,
      });

      // Redirect to login
      router.push(redirectPath);
    }
  }, [router, redirectPath]);

  const formatTimeRemaining = useCallback(() => {
    return sessionManager.getFormattedTimeRemaining();
  }, []);
  useEffect(() => {
    // Initialize session manager only if user is authenticated
    if (authService.isAuthenticated()) {
      sessionManager.init(handleSessionExpired, handleSessionWarning, handleTokenRefresh);
      
      // Update initial state
      updateSessionState();

      // Set up periodic state updates
      const intervalId = setInterval(updateSessionState, 1000);

      return () => {
        clearInterval(intervalId);
      };
    }

    return () => {
      // Cleanup on unmount
      sessionManager.destroy();
    };
  }, [handleSessionExpired, handleSessionWarning, handleTokenRefresh, updateSessionState]);

  return {
    sessionState,
    extendSession,
    logout,
    formatTimeRemaining,
  };
}

export default useSession;
