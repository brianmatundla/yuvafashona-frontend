'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  full_name: string;
  is_admin: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, full_name: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    
    localStorage.setItem('token', data.data.token);
    localStorage.setItem('user', JSON.stringify(data.data.user));
    setToken(data.data.token);
    setUser(data.data.user);
  };

  const register = async (email: string, password: string, full_name: string) => {
    const res = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, full_name })
    });
    
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    
    localStorage.setItem('token', data.data.token);
    localStorage.setItem('user', JSON.stringify(data.data.user));
    setToken(data.data.token);
    setUser(data.data.user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};