'use client';

import { useEffect, useState } from 'react';
import { authService, User } from '@/services/authService';

interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  login: (email: string, password: string, remember?: boolean) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = authService.getToken();
        if (token) {
          const userData = authService.getUserData();
          if (userData) {
            setUser(userData);
          } else {
            // Token exists but no user data, try to fetch profile
            await refreshUser();
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Clear invalid token
        authService.removeToken();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string, remember: boolean = false): Promise<boolean> => {
    try {
      const response = await authService.login({
        login: email,
        password,
        remember,
      });

      if (response.success && response.data) {
        setUser(response.data.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      authService.removeToken();
    }
  };

  const refreshUser = async (): Promise<void> => {
    try {
      const response = await authService.getProfile();
      if (response.success && response.data) {
        setUser(response.data.user);
        authService.setUserData(response.data.user);
      }
    } catch (error) {
      console.error('Refresh user error:', error);
      // If profile fetch fails, clear auth state
      setUser(null);
      authService.removeToken();
    }
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';
  const isSuperAdmin = user?.role === 'super_admin';

  return {
    user,
    loading,
    isAuthenticated,
    isAdmin,
    isSuperAdmin,
    login,
    logout,
    refreshUser,
  };
}
