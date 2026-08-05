import '../global.css';
import { Stack } from 'expo-router';
import { ThemeProvider as NavThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View } from 'react-native';
import { useAppState } from '@/hooks/useAppState';

// React Navigation bellek yönetimindeki donma/siyah ekran sorunlarını engellemek için.
// Siyah ekran hatası devam ettiği için screens optimizasyonunu kapatma kodunu (enableScreens(false)) 
// iOS 17+'da başka bir boş ekran hatasına yol açtığı için kaldırıyoruz.

function RootStack() {
  const { colors, isDark } = useTheme();
  
  const navTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      background: colors.background,
      card: colors.surface,
      text: colors.textPrimary,
      border: colors.border,
      primary: colors.primary,
      primary: colors.primary,
    },
  };

  // AppState hook'u ile önplan/arkaplan kontrolü
  const { isForeground } = useAppState();

  // Arkaplandayken ağır renderları durdurmak veya geri dönüşte UI'ı yenilemek için 
  // isForeground bilgisini kullanabiliriz. (Eğer tamamen unmount gerekiyorsa)
  if (!isForeground) {
    // Çok kritik durumlarda sadece boş View dönebilir veya UI'ı dondurabiliriz,
    // ancak genellikle Expo Router kendi halleder, biz freezeOnBlur ayarı yapacağız.
  }
  
  return (
    <NavThemeProvider value={navTheme}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.textPrimary,
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: colors.background },
          freezeOnBlur: false, // Siyah ekran hatasını önleyen en kritik ayarlardan biri
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false, freezeOnBlur: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false, freezeOnBlur: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="detail/[id]"
          options={{ title: '', headerBackTitle: 'Geri' }}
        />
      </Stack>
    </NavThemeProvider>
  );
}

import Toast from 'react-native-toast-message';
import { toastConfig } from '@/config/toastConfig';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <ThemeProvider>
          <RootStack />
        </ThemeProvider>
      </AuthProvider>
      <Toast config={toastConfig} />
    </GestureHandlerRootView>
  );
}
