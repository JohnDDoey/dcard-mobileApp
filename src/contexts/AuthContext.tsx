'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Utilisateur de test simple
const TEST_USER = {
  id: '1',
  email: 'user1@gmail.com',
  name: 'user1',
  password: 'user1!'
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Vérifier si l'utilisateur est connecté au chargement
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log('🔐 Tentative de connexion:', { email, password });
    
    // Vérification simple
    if (email === TEST_USER.email && password === TEST_USER.password) {
      const userData = {
        id: TEST_USER.id,
        email: TEST_USER.email,
        name: TEST_USER.name
      };
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      console.log('✅ Connexion réussie:', userData);
      return true;
    }
    
    console.log('❌ Connexion échouée');
    return false;
  };

  const logout = () => {
    console.log('🚪 Déconnexion');
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
