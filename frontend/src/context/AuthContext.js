import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi } from '@/api/endpoints/auth.api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('cinebook_token');
      const storedUser = await AsyncStorage.getItem('cinebook_user');
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.log('Auth yükleme hatası:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username, password) => {
    const response = await authApi.login(username, password);
    const { user: userData, token: userToken } = response.data.data;

    await AsyncStorage.setItem('cinebook_token', userToken);
    await AsyncStorage.setItem('cinebook_user', JSON.stringify(userData));

    setToken(userToken);
    setUser(userData);
    return userData;
  };

  const register = async (username, email, password) => {
    const response = await authApi.register(username, email, password);
    const { user: userData, token: userToken } = response.data.data;

    await AsyncStorage.setItem('cinebook_token', userToken);
    await AsyncStorage.setItem('cinebook_user', JSON.stringify(userData));

    setToken(userToken);
    setUser(userData);
    return userData;
  };

  const logout = async () => {
    await AsyncStorage.removeItem('cinebook_token');
    await AsyncStorage.removeItem('cinebook_user');
    setToken(null);
    setUser(null);
  };

  const updateUser = async (newUserData) => {
    const updatedUser = { ...user, ...newUserData };
    await AsyncStorage.setItem('cinebook_user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const isAdmin = user?.is_admin === 1;
  const privileges = user?.privileges || {};

  return (
    <AuthContext.Provider value={{ user, token, isLoading, isAdmin, privileges, login, register, logout, updateUser }}>
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
