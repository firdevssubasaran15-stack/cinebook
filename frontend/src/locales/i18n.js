import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from './en.json';
import tr from './tr.json';
import es from './es.json';

const LANGUAGE_KEY = '@app_language';

const resources = {
  en: { translation: en },
  tr: { translation: tr },
  es: { translation: es },
};

const languageDetector = {
  type: 'languageDetector',
  async: true,
  detect: async (callback) => {
    try {
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
      if (savedLanguage) {
        return callback(savedLanguage);
      }
      return callback('en'); // Default to English if no language is saved
    } catch (error) {
      console.log('Error reading language from AsyncStorage', error);
      return callback('en');
    }
  },
  init: () => {},
  cacheUserLanguage: async (language) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_KEY, language);
    } catch (error) {
      console.log('Error saving language to AsyncStorage', error);
    }
  },
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v4', // Required for React Native
    resources,
    fallbackLng: 'en',
    react: {
      useSuspense: false, // React Native doesn't support suspense for i18n well yet
    },
    interpolation: {
      escapeValue: false, // React already does escaping
    },
  });

export default i18n;
