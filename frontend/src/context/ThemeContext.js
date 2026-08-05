import React, { createContext, useContext, useState, useEffect } from 'react';
import { Appearance } from 'react-native';
import { storageService } from '@/services/storage.service';
import { useColorScheme } from 'nativewind';
import { LIGHT_COLORS, DARK_COLORS } from '@/constants/colors';
import { useAuth } from './AuthContext';
import apiClient from '@/api/apiClient';
import { useToastNotification } from '@/hooks/useToastNotification';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const { colorScheme, setColorScheme } = useColorScheme();
  const systemTheme = Appearance.getColorScheme();
  
  // Use NativeWind's colorScheme as source of truth if available, otherwise fallback
  const [theme, setTheme] = useState(colorScheme || systemTheme || 'dark');
  const { user, updateUser } = useAuth();
  const [isInitializing, setIsInitializing] = useState(true);
  const { showThemeChange } = useToastNotification();

  // Apply user preference when logged in
  useEffect(() => {
    const initTheme = async () => {
      try {
        let activeTheme = theme;
        if (user?.theme_preference) {
          activeTheme = user.theme_preference;
        } else {
          const localTheme = await storageService.getItem('cinebook_theme');
          if (localTheme) {
            activeTheme = localTheme;
          }
        }
        setTheme(activeTheme);
        if (setColorScheme) setColorScheme(activeTheme);
        
        // Appearance.setColorScheme might not be available in all RN versions
        if (Appearance && typeof Appearance.setColorScheme === 'function') {
          Appearance.setColorScheme(activeTheme);
        }
      } catch (err) {
        console.warn('Tema yuklenirken hata olustu:', err);
      } finally {
        setIsInitializing(false);
      }
    };
    initTheme();
  }, [user]);

  const toggleTheme = async () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    setColorScheme(newTheme);
    Appearance.setColorScheme(newTheme);
    await storageService.setItem('cinebook_theme', newTheme);
    
    showThemeChange(newTheme === 'dark');
    
    if (user) {
      try {
        await apiClient.put('/api/auth/theme', { theme: newTheme });
        if (updateUser) {
          await updateUser({ theme_preference: newTheme });
        }
      } catch (err) {
        console.error('Tema kaydedilemedi:', err);
      }
    }
  };

  const colors = theme === 'dark' ? DARK_COLORS : LIGHT_COLORS;
  const isDark = theme === 'dark';

  // Expo Router'ın Splash ekranını gizleyebilmesi için RootStack'in (children) 
  // her halükarda render edilmesi gerekiyor. Bu yüzden return null; iptal edildi.

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme, ThemeProvider içinde kullanılmalıdır.');
  }
  return context;
};
