const contentRepository = require('./content.repository');
const ContentEmotionsUtils = require('./contentEmotions.utils');

class ContentRecommendationService {
  getRecommendationsByMood(mood) {
    const types = ['movie', 'series', 'book'];
    const result = {};

    for (const type of types) {
      const items = contentRepository.getLatestByTypeWithComments(type, 50);
      const itemsWithEmotions = ContentEmotionsUtils.attachTopEmotions(items) || [];
      const match = itemsWithEmotions.find(c => c.top_emotions && c.top_emotions.includes(mood));
      result[type] = match || null;
    }

    return result;
  }

  getUndiscoveredByMood(userId, mood, type = null) {
    const items = contentRepository.getUndiscoveredByTag(userId, mood, type);
    
    const itemsWithEmotions = ContentEmotionsUtils.attachTopEmotions(items) || [];
    const validItems = itemsWithEmotions.filter(c => c.top_emotions && c.top_emotions.includes(mood));
    
    return validItems;
  }
}

module.exports = new ContentRecommendationService();
