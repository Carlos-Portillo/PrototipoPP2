import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, Role } from '../types';

interface AuthContextType {
  user: User | null;
  login: (role: Role) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('xiricode_session');
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const login = (role: Role) => {
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: role === 'CAJERO' ? 'Agente de Ventas' : role === 'SUPERVISOR' ? 'Admin TI' : 'Gerencia Operativa',
      email: `${role.toLowerCase()}@xiricode.com`,
      role,
      token: `jwt_mock_${role}_${Date.now()}`
    };
    setUser(mockUser);
    localStorage.setItem('xiricode_session', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('xiricode_session');
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};