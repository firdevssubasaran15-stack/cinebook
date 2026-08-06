const tr = require('../locales/tr.json');
const en = require('../locales/en.json');

class TranslationService {
  constructor() {
    this.locales = {
      tr,
      en,
    };
    this.defaultLocale = 'tr';
  }

  /**
   * Retrieves the translated string for a given key.
   * Supports dot notation, e.g., 'emotions.happiness'.
   *
   * @param {string} key - The translation key.
   * @param {string} locale - The target locale (e.g., 'tr' or 'en').
   * @returns {string} The translated text or the key if not found.
   */
  translate(key, locale = this.defaultLocale) {
    const keys = key.split('.');
    let result = this.locales[locale] || this.locales[this.defaultLocale];
    
    for (const k of keys) {
      if (result && result[k]) {
        result = result[k];
      } else {
        return key;
      }
    }
    
    return result;
  }
}

// Export as a singleton instance (DI ready if needed to be passed around)
module.exports = new TranslationService();
