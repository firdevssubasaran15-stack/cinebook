import { useLanguage } from '@/hooks/useLanguage';

/**
 * Returns a translated label for a given content type.
 * Follows SRP: single source of truth for content-type display strings.
 *
 * @returns {{ getContentTypeLabel: (type: string) => string }}
 */
export function useContentTypeLabel() {
  const { t } = useLanguage();

  const getContentTypeLabel = (type) => {
    switch (type) {
      case 'movie':  return t('contentTypes.movie',  { defaultValue: '🎦 Movie' });
      case 'series': return t('contentTypes.series', { defaultValue: '📺 Series' });
      case 'book':   return t('contentTypes.book',   { defaultValue: '📚 Book' });
      default:       return type ?? '';
    }
  };

  return { getContentTypeLabel };
}
