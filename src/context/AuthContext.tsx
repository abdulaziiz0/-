/**
 * MIJHAR - Auth & Role Management Context
 * Supports real login/signup, session persistence, role-based access, and demo role switching.
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, UserRole } from '../types/index.ts';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  signup: (name: string, email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  switchDemoRole: (role: UserRole) => Promise<void>;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    // Check saved session or initialize default demo user
    const savedUserId = localStorage.getItem('mijhar_user_id') || 'user-demo-1';
    fetch('/api/auth/me', {
      headers: { 'x-user-id': savedUserId },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) {
          setUser(data.user);
          localStorage.setItem('mijhar_user_id', data.user.id);
        }
      })
      .catch((err) => console.warn('Auth check error:', err))
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (email: string, pass: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass }),
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        localStorage.setItem('mijhar_user_id', data.user.id);
        setIsAuthModalOpen(false);
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  const signup = async (name: string, email: string, pass: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password: pass }),
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        localStorage.setItem('mijhar_user_id', data.user.id);
        setIsAuthModalOpen(false);
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  const logout = () => {
    fetch('/api/auth/logout', {
      method: 'POST',
      headers: { 'x-user-id': user?.id || '' },
    }).catch(console.error);

    localStorage.removeItem('mijhar_user_id');
    setUser(null);
  };

  const switchDemoRole = async (role: UserRole) => {
    const emailMap: Record<UserRole, string> = {
      admin: 'admin@mijhar.org',
      reviewer: 'reviewer@mijhar.org',
      user: 'eng.yazed0@gmail.com',
    };
    await login(emailMap[role], 'mijhar1234');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        signup,
        logout,
        switchDemoRole,
        isAuthModalOpen,
        openAuthModal: () => setIsAuthModalOpen(true),
        closeAuthModal: () => setIsAuthModalOpen(false),
      }}
    >
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
