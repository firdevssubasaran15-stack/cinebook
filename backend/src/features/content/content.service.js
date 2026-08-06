const contentRepository = require('./content.repository');
const feelingsService = require('@/features/feelings/feelings.service');
const commentsService = require('@/features/comments/comments.service');
const contentValidator = require('./content.validator');
const contentRecommendationService = require('./contentRecommendation.service');
const ContentEmotionsUtils = require('./contentEmotions.utils');

class ContentService {
  getRecommendationsByMood(mood) {
    return contentRecommendationService.getRecommendationsByMood(mood);
  }

  getUndiscoveredByMood(userId, mood, type = null) {
    return contentRecommendationService.getUndiscoveredByMood(userId, mood, type);
  }

  getLatestByType() {
    const types = ['movie', 'series', 'book'];
    const result = {};

    for (const type of types) {
      const items = contentRepository.getMostCommentedRecent(type, 5);
      result[type] = ContentEmotionsUtils.attachTopEmotions(items);
    }

    return result;
  }

  getByType(type, search = '') {
    if (search) {
      const items = contentRepository.searchByType(type, search);
      return ContentEmotionsUtils.attachTopEmotions(items);
    }
    const items = contentRepository.getByType(type);
    return ContentEmotionsUtils.attachTopEmotions(items);
  }

  getById(id) {
    const item = contentRepository.findById(id);
    if (!item) throw new Error('İçerik bulunamadı.');
    return ContentEmotionsUtils.attachTopEmotions(item);
  }

  create({ type, title, director_author, summary, cover_image }) {
    contentValidator.validateType(type);

    const t = title.trim();
    const d = director_author.trim();
    
    contentValidator.validateRequiredFields(t, d);
    contentValidator.validateShortTitle(type, t, d);

    const existing = contentRepository.findDuplicate(type, t, d);
    if (existing) {
      throw new Error('Bu yönetmen/yazar\'a ait aynı isimde bir içerik zaten mevcut.');
    }

    const result = contentRepository.insert(type, t, d, summary || '', cover_image || null);
    return contentRepository.findById(result.lastInsertRowid);
  }

  update(id, { title, director_author, summary, cover_image }) {
    const item = contentRepository.findById(id);
    if (!item) throw new Error('İçerik bulunamadı.');

    const t = title ? title.trim() : item.title;
    const d = director_author ? director_author.trim() : item.director_author;
    const s = summary !== undefined ? summary.trim() : item.summary;
    const c = cover_image !== undefined ? cover_image : item.cover_image;

    contentValidator.validateRequiredFields(t, d);
    contentValidator.validateShortTitle(item.type, t, d);

    if (t !== item.title || d !== item.director_author) {
      const existing = contentRepository.findDuplicate(item.type, t, d, id);
      if (existing) {
        throw new Error('Bu yönetmen/yazar\'a ait aynı isimde bir içerik zaten mevcut.');
      }
    }

    contentRepository.update(id, t, d, s, c);
    return this.getById(id);
  }

  delete(id) {
    const item = contentRepository.findById(id);
    if (!item) throw new Error('İçerik bulunamadı.');

    feelingsService.deleteByContentId(id);
    commentsService.deleteByContentId(id);
    contentRepository.delete(id);
    return true;
  }
}

module.exports = new ContentService();
