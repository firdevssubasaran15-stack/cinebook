import Toast from 'react-native-toast-message';

/**
 * Custom hook for displaying toast notifications globally.
 * Follows Single Responsibility Principle by abstracting toast library logic.
 */
export function useToastNotification() {
  const showSuccess = (text1, text2 = '') => {
    Toast.show({
      type: 'success',
      text1,
      text2,
      position: 'top',
      visibilityTime: 3000,
    });
  };

  const showError = (text1, text2 = '') => {
    Toast.show({
      type: 'error',
      text1,
      text2,
      position: 'top',
      visibilityTime: 4000,
    });
  };

  const showInfo = (text1, text2 = '') => {
    Toast.show({
      type: 'info',
      text1,
      text2,
      position: 'top',
      visibilityTime: 3000,
    });
  };

  const showThemeChange = (isDark) => {
    Toast.show({
      type: 'themeChange',
      text1: isDark ? 'Koyu temaya geçildi' : 'Açık temaya geçildi',
      props: { isDark },
      position: 'top',
      visibilityTime: 3000,
    });
  };

  return { showSuccess, showError, showInfo, showThemeChange };
}
