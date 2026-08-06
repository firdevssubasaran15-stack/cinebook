const feelingsService = require('@/features/feelings/feelings.service');

class ContentEmotionsUtils {
  /**
   * Attaches the top emotions to a list of content items based on feeling stats
   * @param {Object|Array} contents - A single content object or array of content objects
   * @returns {Object|Array} The content(s) with 'top_emotions' attached
   */
  static attachTopEmotions(contents) {
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
}

module.exports = ContentEmotionsUtils;
