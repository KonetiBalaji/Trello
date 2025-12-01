import React, { createContext, useContext, ReactNode } from 'react';

interface User {
  username?: string;
  attributes?: {
    email?: string;
    sub?: string;
  };
}

interface AuthContextType {
  user: User | null;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
  user: User | null;
  signOut: () => void;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children, user, signOut }) => {
  return (
    <AuthContext.Provider value={{ user, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

