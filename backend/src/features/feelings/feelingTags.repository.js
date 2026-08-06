const { dbQuery, dbGet, dbRun } = require('@/database/db');

class FeelingTagsRepository {
  findTagsByFeelingId(feelingId) {
    return dbQuery('SELECT tag FROM feeling_tags WHERE feeling_id = ?', [feelingId]);
  }

  insertTags(feelingId, tags) {
    for (const tag of tags) {
      dbRun('INSERT INTO feeling_tags (feeling_id, tag) VALUES (?, ?)', [feelingId, tag]);
    }
  }

  deleteTags(feelingId) {
    return dbRun('DELETE FROM feeling_tags WHERE feeling_id = ?', [feelingId]);
  }

  getTopEmotionsForContents(contentIds) {
    if (!contentIds || contentIds.length === 0) return [];
    return dbQuery(`
      SELECT f.content_id, ft.tag, COUNT(ft.tag) as count
      FROM feeling_tags ft
      JOIN feelings f ON ft.feeling_id = f.id
      WHERE f.content_id IN (${contentIds.join(',')})
      GROUP BY f.content_id, ft.tag
    `);
  }

  deleteTagsByContentId(contentId) {
    return dbRun('DELETE FROM feeling_tags WHERE feeling_id IN (SELECT id FROM feelings WHERE content_id = ?)', [contentId]);
  }

  getUserTopEmotions(userId, limit) {
    return dbQuery(`
      SELECT t.tag, COUNT(*) as count
      FROM feelings f
      JOIN feeling_tags t ON f.id = t.feeling_id
      WHERE f.user_id = ?
      GROUP BY t.tag
      ORDER BY count DESC, f.created_at DESC
      LIMIT ?
    `, [userId, limit]);
  }

  getUserWeeklyEmotion(userId) {
    return dbGet(`
      SELECT t.tag, COUNT(*) as count
      FROM feelings f
      JOIN feeling_tags t ON f.id = t.feeling_id
      WHERE f.user_id = ? AND f.created_at >= datetime('now', '-7 days')
      GROUP BY t.tag
      ORDER BY count DESC, f.created_at DESC
      LIMIT 1;
    `, [userId]);
  }
}

module.exports = new FeelingTagsRepository();
