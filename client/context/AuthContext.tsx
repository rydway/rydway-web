"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types/models';
import { authService } from '@/services/auth.service';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/** Sets a cookie accessible to Next.js middleware (not httpOnly so edge can read it). */
function setCookie(name: string, value: string, days = 7) {
  if (typeof document === 'undefined') return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function deleteCookie(name: string) {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('rydway_token');
      if (token) {
        try {
          const profile = await authService.getProfile();
          setUser(profile);
          // Sync cookies so middleware can read role
          setCookie('rydway_token', token);
          setCookie('rydway_role', profile.role);
        } catch (error) {
          console.error('Failed to fetch profile', error);
          localStorage.removeItem('rydway_token');
          deleteCookie('rydway_token');
          deleteCookie('rydway_role');
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = (token: string, userData: User) => {
    localStorage.setItem('rydway_token', token);
    setUser(userData);
    // Write cookies for middleware
    setCookie('rydway_token', token);
    setCookie('rydway_role', userData.role);
  };

  const logout = () => {
    localStorage.removeItem('rydway_token');
    deleteCookie('rydway_token');
    deleteCookie('rydway_role');
    setUser(null);
    // Redirect to login
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login';
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
