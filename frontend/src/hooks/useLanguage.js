import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';

export const useLanguage = () => {
  const { i18n, t } = useTranslation();

  const currentLanguage = i18n.language || 'en';

  const toggleLanguage = useCallback(async () => {
    const newLang = currentLanguage === 'en' ? 'tr' : 'en';
    await i18n.changeLanguage(newLang);
  }, [currentLanguage, i18n]);

  const changeLanguage = useCallback(async (lang) => {
    if (lang !== currentLanguage) {
      await i18n.changeLanguage(lang);
    }
  }, [currentLanguage, i18n]);

  return {
    currentLanguage,
    toggleLanguage,
    changeLanguage,
    t,
  };
};
