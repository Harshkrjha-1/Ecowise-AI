import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, LoginData, RegisterData } from '../types/auth';
import { authApi } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  quickDemoLogin: (role: 'admin' | 'student') => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('ecowise_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMe = async () => {
      if (token && token !== 'null') {
        try {
          const userData = await authApi.getMe();
          setUser(userData);
        } catch (error) {
          console.error("Failed to load user profile", error);
          logout();
        }
      } else {
        // Start unauthenticated so user sees the Login & Authentication view
        setUser(null);
        setToken(null);
      }
      setIsLoading(false);
    };

    fetchMe();
  }, [token]);

  const login = async (data: LoginData) => {
    setIsLoading(true);
    try {
      const res = await authApi.login(data);
      localStorage.setItem('ecowise_token', res.access_token);
      setToken(res.access_token);
      setUser(res.user);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    try {
      const res = await authApi.register(data);
      localStorage.setItem('ecowise_token', res.access_token);
      setToken(res.access_token);
      setUser(res.user);
    } finally {
      setIsLoading(false);
    }
  };

  const quickDemoLogin = async (role: 'admin' | 'student') => {
    setIsLoading(true);
    const demoEmail = role === 'admin' ? 'operator@ecowise.ai' : 'student@ecowise.ai';
    const demoPass = role === 'admin' ? 'admin123' : 'student123';
    try {
      const res = await authApi.login({ email: demoEmail, password: demoPass });
      localStorage.setItem('ecowise_token', res.access_token);
      setToken(res.access_token);
      setUser(res.user);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('ecowise_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        quickDemoLogin,
        logout,
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
