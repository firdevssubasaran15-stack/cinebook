import React, { createContext, useContext } from 'react';
import { useAuthLogic } from '@/features/auth/hooks/useAuthLogic';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const authLogic = useAuthLogic();

  return (
    <AuthContext.Provider value={authLogic}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth, AuthProvider içinde kullanılmalıdır.');
  }
  return context;
}
