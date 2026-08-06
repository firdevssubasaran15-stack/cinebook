const { VALID_TAGS } = require('./feelings.constants');

class FeelingsValidator {
  /**
   * Validates tags and text input for feelings creation and updating
   * @param {string} text - Feeling text
   * @param {Array<string>} tags - Feeling tags
   */
  static validateFeelingInput(text, tags = []) {
    if ((!text || text.trim().length === 0) && (!tags || tags.length === 0)) {
      throw new Error('İçerik boş olamaz, en az bir etiket seçmelisiniz veya bir metin girmelisiniz.');
    }

    const invalidTags = tags.filter((t) => !VALID_TAGS.includes(t));
    if (invalidTags.length > 0) {
      throw new Error(`Geçersiz etiketler: ${invalidTags.join(', ')}`);
    }
  }

  /**
   * Validates a single tag used for searching
   * @param {string} tag - Feeling tag
   */
  static validateTagSearch(tag) {
    if (!VALID_TAGS.includes(tag)) {
      throw new Error(`Geçersiz etiket. Geçerli etiketler: ${VALID_TAGS.join(', ')}`);
    }
  }
}

module.exports = FeelingsValidator;
