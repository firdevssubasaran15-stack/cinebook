const translationService = require('../../shared/services/translation.service');

class UsersEmotionsUtils {
  /**
   * @param {object} translator - Translation service instance for Dependency Injection
   */
  constructor(translator) {
    this.translator = translator;
  }

  /**
   * Pads the given rows of emotions up to the specified limit with generic emotions.
   * 
   * @param {Array} rows - Array of user emotion objects (e.g., { tag: '...' })
   * @param {number} limit - Maximum number of emotions to return
   * @param {string} locale - Target language code (default 'tr')
   * @returns {Array<string>} Array of emotion tags
   */
  padEmotions(rows, limit, locale = 'tr') {
    const genericEmotionKeys = [
      'emotions.happiness',
      'emotions.peace',
      'emotions.excitement',
      'emotions.love',
      'emotions.hope',
      'emotions.curiosity'
    ];
    
    const tags = rows.map((r) => r.tag);

    if (tags.length < limit) {
      for (const key of genericEmotionKeys) {
        const translatedEmotion = this.translator.translate(key, locale);
        if (!tags.includes(translatedEmotion)) {
          tags.push(translatedEmotion);
        }
        if (tags.length >= limit) break;
      }
    }

    return tags;
  }
}

module.exports = new UsersEmotionsUtils(translationService);
