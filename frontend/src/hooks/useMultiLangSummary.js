import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from './useLanguage';

const LANGUAGES = ['tr', 'en', 'es', 'fr'];

export const useMultiLangSummary = (initialValue = '') => {
  const { currentLanguage } = useLanguage();
  
  const [summaries, setSummaries] = useState({
    tr: '',
    en: '',
    es: '',
    fr: ''
  });

  const [activeTab, setActiveTab] = useState('tr');

  // Parse initial value for forms
  useEffect(() => {
    if (!initialValue) {
      setSummaries({ tr: '', en: '', es: '', fr: '' });
      return;
    }
    
    try {
      let parsed = JSON.parse(initialValue);
      if (typeof parsed === 'string') {
        parsed = JSON.parse(parsed); // Double stringified
      }
      
      if (typeof parsed === 'object' && parsed !== null) {
        // Fix corrupted data where 'tr' contains the whole JSON string
        if (typeof parsed.tr === 'string' && parsed.tr.startsWith('{')) {
          try {
            const inner = JSON.parse(parsed.tr);
            if (typeof inner === 'object') {
              parsed = { ...parsed, ...inner };
            }
          } catch(e) {}
        }

        setSummaries({
          tr: parsed.tr || '',
          en: parsed.en || '',
          es: parsed.es || '',
          fr: parsed.fr || ''
        });
      } else {
        setSummaries(prev => ({ ...prev, tr: String(initialValue) }));
      }
    } catch (e) {
      // Not JSON, assume it's legacy plain text (fallback to TR)
      setSummaries(prev => ({ ...prev, tr: initialValue }));
    }
  }, [initialValue]);

  const updateSummary = useCallback((lang, text) => {
    setSummaries(prev => ({ ...prev, [lang]: text }));
  }, []);

  const getSummaryJsonString = useCallback(() => {
    return JSON.stringify(summaries);
  }, [summaries]);

  // Static/utility method to parse summary string directly for display components
  const getLocalizedSummary = useCallback((rawSummaryStr, targetLang) => {
    const lang = targetLang || currentLanguage || 'tr';
    if (!rawSummaryStr) return '';
    try {
      let parsed = JSON.parse(rawSummaryStr);
      if (typeof parsed === 'string') {
        parsed = JSON.parse(parsed); // Double stringified
      }
      
      if (typeof parsed === 'object' && parsed !== null) {
        let localized = parsed[lang] || parsed['tr'] || parsed['en'] || Object.values(parsed).find(v => v) || '';
        
        // Handle corrupted data where the localized text is itself a JSON string
        if (typeof localized === 'string' && localized.startsWith('{')) {
          try {
            const inner = JSON.parse(localized);
            if (typeof inner === 'object') {
              localized = inner[lang] || inner['tr'] || inner['en'] || Object.values(inner).find(v => v) || '';
            }
          } catch(e) {}
        }
        return localized;
      }
      return rawSummaryStr;
    } catch (e) {
      return rawSummaryStr;
    }
  }, [currentLanguage]);

  return {
    summaries,
    setSummaries,
    activeTab,
    setActiveTab,
    updateSummary,
    getSummaryJsonString,
    getLocalizedSummary,
    LANGUAGES
  };
};
