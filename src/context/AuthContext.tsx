import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api } from '../utils/api';

export interface Plan {
  id: string;
  name: string;
  durationDays: number;
  price: number; // in INR (₹) as base currency
  currency: string;
  tickets: number;
  badge?: string;
  isPopular?: boolean;
}

export const SUBSCRIPTION_PLANS: Plan[] = [
  { id: '1-day', name: '1 Day', durationDays: 1, price: 99, currency: '৳', tickets: 1, isPopular: true },
  { id: '2-day', name: '2 Day', durationDays: 2, price: 190, currency: '৳', tickets: 1 },
  { id: '3-day', name: '3 Day', durationDays: 3, price: 280, currency: '৳', tickets: 1 },
  { id: '4-day', name: '4 Day', durationDays: 4, price: 360, currency: '৳', tickets: 1 },
  { id: '4-day-v2', name: '4 Day v2', durationDays: 4, price: 390, currency: '৳', tickets: 2 },
  { id: '5-day', name: '5 Day', durationDays: 5, price: 450, currency: '৳', tickets: 2 },
  { id: 'weekly-v1', name: 'Weekly (7 Day) v1', durationDays: 7, price: 600, currency: '৳', tickets: 2 },
  { id: 'weekly-v2', name: 'Weekly (7 Day) v2', durationDays: 7, price: 750, currency: '৳', tickets: 3 },
  { id: '10-days', name: '10 Days', durationDays: 10, price: 950, currency: '৳', tickets: 4 },
  { id: '15-days', name: '15 Days', durationDays: 15, price: 1350, currency: '৳', tickets: 7 },
  { id: 'monthly-v1', name: 'Monthly (30 Day) v1', durationDays: 30, price: 2500, currency: '৳', tickets: 15 },
  { id: 'monthly-v2', name: 'Monthly (30 Day) v2', durationDays: 30, price: 3000, currency: '৳', tickets: 20 },
  { id: '3-months', name: '3 Months (90 Day)', durationDays: 90, price: 4500, currency: '৳', tickets: 45 },
  { id: '6-months', name: '6 Months (180 Day)', durationDays: 180, price: 6000, currency: '৳', tickets: 90 },
  { id: 'yearly-v1', name: 'Yearly (365 Day) v1', durationDays: 365, price: 8000, currency: '৳', tickets: 125 },
  { id: 'yearly-v2', name: 'Yearly (365 Day) v2', durationDays: 365, price: 9500, currency: '৳', tickets: 150 },
];

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role?: 'user' | 'admin';
  planId?: string | null;
  planName?: string | null;
  planExpiryDate?: string | null;
  planExpiryTimestamp?: number | null; // Exact millisecond timestamp when subscription ends
  ticketsRemaining?: number;
  hasActiveSubscription: boolean;
  overlayKey?: string; // Secret key for this account's OBS overlay links
  memberSince?: string;
}

export interface AuthResult {
  ok: boolean;
  error?: string;
}

interface AuthContextType {
  user: User | null;
  /** True until the first session check with the server finishes */
  authLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  hasActiveSubscription: boolean;
  authModalOpen: boolean;
  authModalMode: AuthModalMode;
  openAuthModal: (mode?: AuthModalMode) => void;
  closeAuthModal: () => void;
  login: (email: string, password: string) => Promise<AuthResult>;
  signup: (name: string, email: string, password: string, phone?: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  submitPayment: (plan: Plan, method: 'bkash' | 'nagad', trxId: string, sender?: string) => Promise<AuthResult>;
  loginWithGoogle: (credential: string) => Promise<AuthResult>;
  requestPasswordReset: (email: string) => Promise<AuthResult>;
  resetPassword: (token: string, password: string) => Promise<AuthResult>;
  /** Server features that depend on hosting settings */
  appConfig: { googleClientId: string | null; emailEnabled: boolean };
}

export type AuthModalMode = 'login' | 'signup' | 'forgot';

const AuthContext = createContext<AuthContextType | null>(null);

// Cached copy only to avoid a flash of "logged out" on reload; the server session is the source of truth.
const AUTH_CACHE_KEY = 'iconicscorer_auth_user_v2';
const LEGACY_KEYS = ['iconicscorer_auth_user', 'iconicscorer_registered_users'];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      LEGACY_KEYS.forEach((k) => localStorage.removeItem(k)); // old fake accounts
      const stored = localStorage.getItem(AUTH_CACHE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<AuthModalMode>('login');
  const [appConfig, setAppConfig] = useState<{ googleClientId: string | null; emailEnabled: boolean }>({
    googleClientId: null,
    emailEnabled: false,
  });

  useEffect(() => {
    api.config().then((res) => {
      if (res.ok) {
        setAppConfig({ googleClientId: res.data.googleClientId || null, emailEnabled: !!res.data.emailEnabled });
      }
    });
  }, []);

  useEffect(() => {
    try {
      if (user) localStorage.setItem(AUTH_CACHE_KEY, JSON.stringify(user));
      else localStorage.removeItem(AUTH_CACHE_KEY);
    } catch {}
  }, [user]);

  const refreshUser = useCallback(async () => {
    const res = await api.me();
    if (res.ok) {
      setUser(res.data?.user || null);
    }
    // On network failure keep the cached user; the server still enforces everything.
  }, []);

  useEffect(() => {
    refreshUser().finally(() => setAuthLoading(false));
    // Re-check periodically so approvals and expiries show up without a reload
    const t = setInterval(refreshUser, 60_000);
    const onFocus = () => refreshUser();
    window.addEventListener('focus', onFocus);
    return () => {
      clearInterval(t);
      window.removeEventListener('focus', onFocus);
    };
  }, [refreshUser]);

  const openAuthModal = (mode: AuthModalMode = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  const login = async (email: string, password: string): Promise<AuthResult> => {
    const res = await api.login(email.trim(), password);
    if (!res.ok) return { ok: false, error: res.error };
    setUser(res.data.user);
    closeAuthModal();
    return { ok: true };
  };

  const signup = async (name: string, email: string, password: string, phone?: string): Promise<AuthResult> => {
    const res = await api.signup(name.trim(), email.trim(), password, phone?.trim());
    if (!res.ok) return { ok: false, error: res.error };
    setUser(res.data.user);
    closeAuthModal();
    return { ok: true };
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
  };

  const submitPayment = async (plan: Plan, method: 'bkash' | 'nagad', trxId: string, sender?: string): Promise<AuthResult> => {
    const res = await api.submitPayment(plan.id, method, trxId.trim(), sender?.trim());
    return res.ok ? { ok: true } : { ok: false, error: res.error };
  };

  const loginWithGoogle = async (credential: string): Promise<AuthResult> => {
    const res = await api.google(credential);
    if (!res.ok) return { ok: false, error: res.error };
    setUser(res.data.user);
    closeAuthModal();
    return { ok: true };
  };

  const requestPasswordReset = async (email: string): Promise<AuthResult> => {
    const res = await api.forgotPassword(email.trim());
    return res.ok ? { ok: true } : { ok: false, error: res.error };
  };

  const resetPassword = async (token: string, password: string): Promise<AuthResult> => {
    const res = await api.resetPassword(token, password);
    if (!res.ok) return { ok: false, error: res.error };
    setUser(res.data.user);
    return { ok: true };
  };

  const hasActiveSubscription =
    !!user?.hasActiveSubscription &&
    (user.role === 'admin' || !user.planExpiryTimestamp || user.planExpiryTimestamp > Date.now());

  return (
    <AuthContext.Provider
      value={{
        user,
        authLoading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        hasActiveSubscription,
        authModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        login,
        signup,
        logout,
        refreshUser,
        submitPayment,
        loginWithGoogle,
        requestPasswordReset,
        resetPassword,
        appConfig,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
