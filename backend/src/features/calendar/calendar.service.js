const { dbQuery } = require('@/database/db');
const contentService = require('@/features/content/content.service');
const ContentEmotionsUtils = require('@/features/content/contentEmotions.utils');

class CalendarService {
  getHistory(userId) {
    // Fetch contents with status 'read' or 'watched', group by date (updated_at)
    const records = dbQuery(`
      SELECT 
        date(l.updated_at) as date,
        l.id as library_id,
        l.status,
        c.*
      FROM library l
      JOIN content c ON l.content_id = c.id
      WHERE l.user_id = ? AND l.status IN ('watched', 'read')
      ORDER BY l.updated_at DESC
    `, [userId]);

    // Apply emotion tags
    const recordsWithEmotions = ContentEmotionsUtils.attachTopEmotions(records) || [];
    const list = Array.isArray(recordsWithEmotions) ? recordsWithEmotions : [recordsWithEmotions];

    // Group by date
    const history = {};
    for (const record of list) {
      if (!record || !record.date) continue;
      const date = record.date;
      if (!history[date]) {
        history[date] = [];
      }
      history[date].push(record);
    }

    return history;
  }
}

module.exports = new CalendarService();
