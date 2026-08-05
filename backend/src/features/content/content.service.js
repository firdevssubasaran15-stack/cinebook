const contentRepository = require('./content.repository');
const feelingsService = require('@/features/feelings/feelings.service');
const commentsService = require('@/features/comments/comments.service');
const contentValidator = require('./content.validator');

class ContentService {
  attachTopEmotions(contents) {
    if (!contents || (Array.isArray(contents) && contents.length === 0)) return contents;
    
    const isSingle = !Array.isArray(contents);
    const list = isSingle ? [contents] : contents;
    
    const contentIds = list.map(c => c.id || c.content_id); // Fallback for library join if needed
    if (contentIds.length === 0) return contents;
    
    const rows = feelingsService.getTopEmotionsForContents(contentIds);

    const tagStats = {};
    for (const row of rows) {
      if (!tagStats[row.content_id]) {
        tagStats[row.content_id] = { maxCount: 0, tags: [] };
      }
      const stat = tagStats[row.content_id];
      if (row.count > stat.maxCount) {
        stat.maxCount = row.count;
        stat.tags = [row.tag];
      } else if (row.count === stat.maxCount) {
        stat.tags.push(row.tag);
      }
    }

    list.forEach(c => {
      const cid = c.id || c.content_id;
      c.top_emotions = tagStats[cid] ? tagStats[cid].tags : [];
    });
    
    return isSingle ? list[0] : list;
  }

  getRecommendationsByMood(mood) {
    const types = ['movie', 'series', 'book'];
    const result = {};

    for (const type of types) {
      const items = contentRepository.getLatestByTypeWithComments(type, 50);
      const itemsWithEmotions = this.attachTopEmotions(items) || [];
      const match = itemsWithEmotions.find(c => c.top_emotions && c.top_emotions.includes(mood));
      result[type] = match || null;
    }

    return result;
  }

  getUndiscoveredByMood(userId, mood, type = null) {
    const items = contentRepository.getUndiscoveredByTag(userId, mood, type);
    
    const itemsWithEmotions = this.attachTopEmotions(items) || [];
    const validItems = itemsWithEmotions.filter(c => c.top_emotions && c.top_emotions.includes(mood));
    
    return validItems;
  }

  getLatestByType() {
    const types = ['movie', 'series', 'book'];
    const result = {};

    for (const type of types) {
      const items = contentRepository.getMostCommentedRecent(type, 5);
      result[type] = this.attachTopEmotions(items);
    }

    return result;
  }

  getByType(type, search = '') {
    if (search) {
      const items = contentRepository.searchByType(type, search);
      return this.attachTopEmotions(items);
    }
    const items = contentRepository.getByType(type);
    return this.attachTopEmotions(items);
  }

  getById(id) {
    const item = contentRepository.findById(id);
    if (!item) throw new Error('İçerik bulunamadı.');
    return this.attachTopEmotions(item);
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
