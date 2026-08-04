const { dbQuery, dbGet, dbRun } = require('@/database/db');
const contentService = require('@/features/content/content.service');
const { LIBRARY_STATUSES } = require('./library.constants');

class LibraryService {
  getUserLibrary(userId) {
    // Get all library items joined with content data
    return contentService.attachTopEmotions(dbQuery(`
      SELECT 
        l.id as library_id,
        l.status,
        l.created_at as added_at,
        c.*
      FROM library l
      JOIN content c ON l.content_id = c.id
      WHERE l.user_id = ?
      ORDER BY l.created_at DESC
    `, [userId]));
  }

  getStatus(userId, contentId) {
    const item = dbGet('SELECT status FROM library WHERE user_id = ? AND content_id = ?', [userId, contentId]);
    return item ? item.status : null;
  }

  upsert(userId, contentId, status) {
    if (!LIBRARY_STATUSES.includes(status)) {
      throw new Error('Geçersiz durum (status).');
    }

    const existing = dbGet('SELECT id FROM library WHERE user_id = ? AND content_id = ?', [userId, contentId]);
    if (existing) {
      dbRun('UPDATE library SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [status, existing.id]);
    } else {
      dbRun('INSERT INTO library (user_id, content_id, status, updated_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)', [userId, contentId, status]);
    }
    return { status };
  }

  getCounts(contentId) {
    const counts = dbQuery('SELECT status, COUNT(*) as count FROM library WHERE content_id = ? GROUP BY status', [contentId]);
    const result = {};
    counts.forEach(row => {
      result[row.status] = row.count;
    });
    return result;
  }

  remove(userId, contentId) {
    dbRun('DELETE FROM library WHERE user_id = ? AND content_id = ?', [userId, contentId]);
    return true;
  }
}

module.exports = new LibraryService();
