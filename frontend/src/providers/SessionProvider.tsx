/**
 * Session Provider Component
 * Provides session management context throughout the application
 */

'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useSession } from '@/hooks/useSession';
import SessionTimeoutDialog from '@/components/session/SessionTimeoutDialog';
import { authService } from '@/services/authService';
import { sessionManager } from '@/utils/sessionManager';

interface SessionContextType {
  sessionState: {
    isActive: boolean;
    timeRemaining: number;
    showWarning: boolean;
    isExpired: boolean;
  };
  extendSession: () => void;
  logout: () => Promise<void>;
  formatTimeRemaining: () => string;
}

const SessionContext = createContext<SessionContextType | null>(null);

interface SessionProviderProps {
  children: React.ReactNode;
}

export function SessionProvider({ children }: SessionProviderProps) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith('/login') || pathname?.startsWith('/register') || 
                     pathname?.startsWith('/forgot-password') || pathname?.startsWith('/reset-password');
  
  const {
    sessionState,
    extendSession,
    logout,
    formatTimeRemaining,
  } = useSession({
    redirectOnExpiry: true,
    redirectPath: '/login',
    showWarningDialog: true,
    warningThreshold: 5 * 60 * 1000, // 5 minutes
  });

  // Initialize session when user logs in
  useEffect(() => {
    if (!isAuthPage && authService.isAuthenticated()) {
      const token = authService.getToken();
      const userData = authService.getUserData();
      
      if (token && userData) {
        // Initialize session with current token
        sessionManager.createSession(token, userData.id);
      }
    }
  }, [isAuthPage, pathname]);

  // Don't provide session context on auth pages
  if (isAuthPage) {
    return <>{children}</>;
  }

  const contextValue: SessionContextType = {
    sessionState,
    extendSession,
    logout,
    formatTimeRemaining,
  };

  return (
    <SessionContext.Provider value={contextValue}>
      {children}
      
      {/* Session Timeout Warning Dialog */}
      <SessionTimeoutDialog
        isOpen={sessionState.showWarning}
        timeRemaining={sessionState.timeRemaining}
        onExtendSession={extendSession}
        onLogout={logout}
        formatTimeRemaining={formatTimeRemaining}
      />
    </SessionContext.Provider>
  );
}

export function useSessionContext(): SessionContextType {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSessionContext must be used within a SessionProvider');
  }
  return context;
}

export default SessionProvider;
