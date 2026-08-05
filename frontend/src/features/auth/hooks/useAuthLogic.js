import { useState, useEffect } from 'react';
import { storageService } from '@/services/storage.service';
import { authApi } from '@/api/endpoints/auth.api';

export function useAuthLogic() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      // Yeni yazdığımız StorageService (Adapter) tüm timeout ve crash durumlarını yönetiyor.
      const storedToken = await storageService.getItem('cinebook_token');
      const parsedUser = await storageService.getJSON('cinebook_user');

      if (storedToken && parsedUser) {
        setToken(storedToken);
        setUser(parsedUser);
      } else {
        // Eğer veriler bozuksa veya zaman aşımına uğradıysa state'i sıfırlıyoruz.
        setToken(null);
        setUser(null);
      }
    } catch (err) {
      console.log('Auth yükleme hatası:', err);
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username, password) => {
    const response = await authApi.login(username, password);
    const { user: userData, token: userToken } = response.data.data;

    await storageService.setItem('cinebook_token', userToken);
    await storageService.setJSON('cinebook_user', userData);

    setToken(userToken);
    setUser(userData);
    return userData;
  };

  const register = async (username, email, password) => {
    const response = await authApi.register(username, email, password);
    const { user: userData, token: userToken } = response.data.data;

    await storageService.setItem('cinebook_token', userToken);
    await storageService.setJSON('cinebook_user', userData);

    setToken(userToken);
    setUser(userData);
    return userData;
  };

  const logout = async () => {
    await storageService.removeItem('cinebook_token');
    await storageService.removeItem('cinebook_user');
    setToken(null);
    setUser(null);
  };

  const updateUser = async (newUserData) => {
    const updatedUser = { ...user, ...newUserData };
    await storageService.setJSON('cinebook_user', updatedUser);
    setUser(updatedUser);
  };

  const isAdmin = user?.is_admin === 1;
  const privileges = user?.privileges || {};

  return {
    user,
    token,
    isLoading,
    isAdmin,
    privileges,
    login,
    register,
    logout,
    updateUser,
  };
}
