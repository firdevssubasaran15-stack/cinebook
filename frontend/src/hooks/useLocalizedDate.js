import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * LOCALE_MAP — Strategy Pattern
 * i18n dil kodu → IETF BCP 47 locale string eşlemesi.
 * Yeni dil eklendiğinde sadece bu nesne güncellenir (OCP).
 */
const LOCALE_MAP = {
  tr: 'tr-TR',
  en: 'en-US',
  es: 'es-ES',
  fr: 'fr-FR',
};

const DEFAULT_DATE_OPTIONS = {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
};

/**
 * useLocalizedDate
 *
 * Aktif i18n diline gore dogru IETF locale ile tarih formatlar.
 * Tum yorum bilesenlerinde tutarli tarih gosterimi saglar.
 *
 * SOLID — SRP : Tarih formatlama mantiginin tek sorumlusu.
 * SOLID — OCP : LOCALE_MAP guncellemesiyle yeni dil destegi.
 * DRY          : 4 dosyadaki duplicate kod buraya tasindi.
 *
 * @returns {{ formatDate: (isoString: string, options?: Intl.DateTimeFormatOptions) => string }}
 */
export function useLocalizedDate() {
  const { i18n } = useTranslation();
  const locale = LOCALE_MAP[i18n.language] ?? 'en-US';

  const formatDate = useCallback(
    (isoString, options = DEFAULT_DATE_OPTIONS) => {
      if (!isoString) return '';
      try {
        return new Date(isoString).toLocaleDateString(locale, options);
      } catch {
        return '';
      }
    },
    [locale]
  );

  return { formatDate };
}
