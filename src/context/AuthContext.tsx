import React, { createContext, useContext, useState, useEffect } from 'react';

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
  { id: '1-day', name: '1 Day', durationDays: 1, price: 250, currency: '₹', tickets: 1, isPopular: true },
  { id: '2-day', name: '2 Day', durationDays: 2, price: 500, currency: '₹', tickets: 1 },
  { id: '3-day', name: '3 Day', durationDays: 3, price: 700, currency: '₹', tickets: 1 },
  { id: '4-day', name: '4 Day', durationDays: 4, price: 800, currency: '₹', tickets: 1 },
  { id: '4-day-v2', name: '4 Day v2', durationDays: 4, price: 850, currency: '₹', tickets: 2 },
  { id: '5-day', name: '5 Day', durationDays: 5, price: 900, currency: '₹', tickets: 2 },
  { id: 'weekly-v1', name: 'Weekly (7 Day) v1', durationDays: 7, price: 1000, currency: '₹', tickets: 2 },
  { id: 'weekly-v2', name: 'Weekly (7 Day) v2', durationDays: 7, price: 1250, currency: '₹', tickets: 3 },
  { id: '10-days', name: '10 Days', durationDays: 10, price: 1600, currency: '₹', tickets: 4 },
  { id: '15-days', name: '15 Days', durationDays: 15, price: 2000, currency: '₹', tickets: 7 },
  { id: 'monthly-v1', name: 'Monthly (30 Day) v1', durationDays: 30, price: 3000, currency: '₹', tickets: 15 },
  { id: 'monthly-v2', name: 'Monthly (30 Day) v2', durationDays: 30, price: 3500, currency: '₹', tickets: 20 },
  { id: '3-months', name: '3 Months (90 Day)', durationDays: 90, price: 6500, currency: '₹', tickets: 45 },
  { id: '6-months', name: '6 Months (180 Day)', durationDays: 180, price: 8000, currency: '₹', tickets: 90 },
  { id: 'yearly-v1', name: 'Yearly (365 Day) v1', durationDays: 365, price: 10000, currency: '₹', tickets: 125 },
  { id: 'yearly-v2', name: 'Yearly (365 Day) v2', durationDays: 365, price: 12500, currency: '₹', tickets: 150 },
];

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  planId?: string;
  planName?: string;
  planExpiryDate?: string;
  ticketsRemaining?: number;
  hasActiveSubscription: boolean;
  memberSince?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  hasActiveSubscription: boolean;
  authModalOpen: boolean;
  authModalMode: 'login' | 'signup';
  openAuthModal: (mode?: 'login' | 'signup') => void;
  closeAuthModal: () => void;
  login: (email: string, password?: string) => Promise<boolean>;
  signup: (name: string, email: string, phone?: string, password?: string) => Promise<boolean>;
  logout: () => void;
  purchasePlan: (plan: Plan, paymentMethod?: string) => Promise<boolean>;
  demoPaidLogin: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const AUTH_STORAGE_KEY = 'iconicscorer_auth_user';
const USERS_DB_KEY = 'iconicscorer_registered_users';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [user]);

  const openAuthModal = (mode: 'login' | 'signup' = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  const login = async (email: string, password?: string): Promise<boolean> => {
    try {
      // Check stored users list
      const storedUsersRaw = localStorage.getItem(USERS_DB_KEY);
      const storedUsers: Array<User & { password?: string }> = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];
      const found = storedUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());

      if (found) {
        setUser(found);
        closeAuthModal();
        return true;
      }

      // If user doesn't exist, create an account session
      const newUser: User = {
        id: `usr-${Date.now()}`,
        name: email.split('@')[0],
        email,
        hasActiveSubscription: false,
        memberSince: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      };

      storedUsers.push(newUser);
      localStorage.setItem(USERS_DB_KEY, JSON.stringify(storedUsers));
      setUser(newUser);
      closeAuthModal();
      return true;
    } catch {
      return false;
    }
  };

  const signup = async (name: string, email: string, phone?: string): Promise<boolean> => {
    try {
      const storedUsersRaw = localStorage.getItem(USERS_DB_KEY);
      const storedUsers: Array<User> = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];

      const existingIndex = storedUsers.findIndex((u) => u.email.toLowerCase() === email.toLowerCase());

      const newUser: User = {
        id: `usr-${Date.now()}`,
        name: name.trim() || 'Cricket Streamer',
        email: email.trim().toLowerCase(),
        phone: phone?.trim(),
        hasActiveSubscription: false,
        memberSince: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      };

      if (existingIndex >= 0) {
        storedUsers[existingIndex] = { ...storedUsers[existingIndex], ...newUser };
      } else {
        storedUsers.push(newUser);
      }

      localStorage.setItem(USERS_DB_KEY, JSON.stringify(storedUsers));
      setUser(newUser);
      closeAuthModal();
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    setUser(null);
  };

  const purchasePlan = async (plan: Plan): Promise<boolean> => {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + plan.durationDays);

    const updatedUser: User = {
      id: user?.id || `usr-${Date.now()}`,
      name: user?.name || 'Pro Streamer',
      email: user?.email || 'streamer@iconicscorer.com',
      phone: user?.phone,
      planId: plan.id,
      planName: plan.name,
      planExpiryDate: expiry.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      ticketsRemaining: (user?.ticketsRemaining || 0) + plan.tickets,
      hasActiveSubscription: true,
      memberSince: user?.memberSince || new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    };

    setUser(updatedUser);

    // Also update in registered users db
    try {
      const storedUsersRaw = localStorage.getItem(USERS_DB_KEY);
      const storedUsers: Array<User> = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];
      const idx = storedUsers.findIndex((u) => u.email === updatedUser.email);
      if (idx >= 0) {
        storedUsers[idx] = updatedUser;
      } else {
        storedUsers.push(updatedUser);
      }
      localStorage.setItem(USERS_DB_KEY, JSON.stringify(storedUsers));
    } catch (e) {
      console.error(e);
    }

    return true;
  };

  // Demo shortcut so testing paid features is effortless
  const demoPaidLogin = () => {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 30);

    const demoUser: User = {
      id: 'usr-demo-pro',
      name: 'Demo Pro Broadcaster',
      email: 'demo@iconicscorer.com',
      planId: 'monthly-v1',
      planName: 'Monthly (30 Day) v1',
      planExpiryDate: expiry.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      ticketsRemaining: 15,
      hasActiveSubscription: true,
      memberSince: 'Oct 2026',
    };
    setUser(demoUser);
    closeAuthModal();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        hasActiveSubscription: !!user?.hasActiveSubscription,
        authModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        login,
        signup,
        logout,
        purchasePlan,
        demoPaidLogin,
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
