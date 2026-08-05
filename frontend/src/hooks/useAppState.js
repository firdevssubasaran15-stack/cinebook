import { useState, useEffect, useRef } from 'react';
import { AppState } from 'react-native';

/**
 * Uygulamanın arkaplan/önplan geçişlerini takip eden Custom Hook.
 * Siyah ekran hatalarının tespitinde ve engellenmesinde UI dondurma/açma için kullanılabilir.
 */
export function useAppState() {
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      // Örnek: Eğer uygulama arkaplandan (background/inactive) önplana (active) geçiyorsa
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('App has come to the foreground!');
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return { appStateVisible, isForeground: appStateVisible === 'active' };
}
