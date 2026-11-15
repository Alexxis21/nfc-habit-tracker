import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import * as authApi from '../api/auth';
import { clearToken, registerUnauthorizedHandler, setToken } from '../api/client';

const USER_KEY = 'auth_user';

interface AuthUser {
  userId: number;
  email: string;
  displayName: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const storedUser = await SecureStore.getItemAsync(USER_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setIsLoading(false);
    })();
  }, []);

  const persistSession = useCallback(async (response: authApi.AuthResponse) => {
    await setToken(response.token);
    const authUser: AuthUser = {
      userId: response.userId,
      email: response.email,
      displayName: response.displayName,
    };
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(authUser));
    setUser(authUser);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const response = await authApi.login({ email, password });
    await persistSession(response);
  }, [persistSession]);

  const register = useCallback(async (email: string, password: string, displayName: string) => {
    const response = await authApi.register({ email, password, displayName });
    await persistSession(response);
  }, [persistSession]);

  const logout = useCallback(async () => {
    await clearToken();
    await SecureStore.deleteItemAsync(USER_KEY);
    setUser(null);
  }, []);

  useEffect(() => {
    registerUnauthorizedHandler(() => {
      SecureStore.deleteItemAsync(USER_KEY);
      setUser(null);
    });
  }, []);

  const value = useMemo(
    () => ({ user, isLoading, login, register, logout }),
    [user, isLoading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth musi być użyty wewnątrz AuthProvider');
  }
  return ctx;
}
