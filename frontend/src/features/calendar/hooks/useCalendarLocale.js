import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { LocaleConfig } from 'react-native-calendars';

/**
 * useCalendarLocale
 *
 * react-native-calendars LocaleConfig'ini aktif i18n diline gore
 * dinamik olarak gunceller. Dil degistiginde takvim basliklari
 * (ay/gun isimleri, "Bugun" etiketi) otomatik reaktif davranis gosterir.
 *
 * SOLID - SRP: Sadece takvim locale yonetiminden sorumludur.
 */
export function useCalendarLocale() {
  const { i18n, t } = useTranslation();
  const lang = i18n.language;

  useEffect(() => {
    const monthNames      = t('calendar.monthNames',      { returnObjects: true });
    const monthNamesShort = t('calendar.monthNamesShort', { returnObjects: true });
    const dayNames        = t('calendar.dayNames',        { returnObjects: true });
    const dayNamesShort   = t('calendar.dayNamesShort',   { returnObjects: true });
    const today           = t('calendar.today');

    LocaleConfig.locales[lang] = {
      monthNames:      Array.isArray(monthNames)      ? monthNames      : [],
      monthNamesShort: Array.isArray(monthNamesShort) ? monthNamesShort : [],
      dayNames:        Array.isArray(dayNames)        ? dayNames        : [],
      dayNamesShort:   Array.isArray(dayNamesShort)   ? dayNamesShort   : [],
      today,
    };

    LocaleConfig.defaultLocale = lang;
  }, [lang, t]);
}
