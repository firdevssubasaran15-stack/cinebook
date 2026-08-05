const { dbQuery, dbGet, dbRun } = require('@/database/db');

class FeelingsRepository {
  findByContentId(contentId, currentUserId) {
    return dbQuery(`
      SELECT 
        f.*, 
        u.username,
        u.profile_image,
        (SELECT COUNT(*) FROM feeling_likes WHERE feeling_id = f.id) as like_count,
        (SELECT COUNT(*) FROM feeling_likes WHERE feeling_id = f.id AND user_id = ?) as is_liked_by_user,
        (SELECT GROUP_CONCAT(tag, ',') FROM feeling_tags WHERE feeling_id = f.id) as tags_string
      FROM feelings f
      JOIN users u ON f.user_id = u.id
      WHERE f.content_id = ?
      ORDER BY f.created_at DESC
    `, [currentUserId, contentId]);
  }

  findTagsByFeelingId(feelingId) {
    return dbQuery('SELECT tag FROM feeling_tags WHERE feeling_id = ?', [feelingId]);
  }

  findByTag(tag, contentType = null) {
    let query = `
      SELECT DISTINCT f.*, u.username, u.profile_image, c.title, c.type, c.cover_image,
        (SELECT GROUP_CONCAT(tag, ',') FROM feeling_tags WHERE feeling_id = f.id) as tags_string
      FROM feelings f
      JOIN users u ON f.user_id = u.id
      JOIN content c ON f.content_id = c.id
      JOIN feeling_tags ft ON ft.feeling_id = f.id
      WHERE ft.tag = ?
    `;
    const params = [tag];

    if (contentType) {
      query += ' AND c.type = ?';
      params.push(contentType);
    }

    query += ' ORDER BY f.created_at DESC';

    return dbQuery(query, params);
  }

  insert(userId, contentId, text) {
    return dbRun(
      'INSERT INTO feelings (user_id, content_id, text) VALUES (?, ?, ?)',
      [userId, contentId, text]
    );
  }

  insertTags(feelingId, tags) {
    for (const tag of tags) {
      dbRun('INSERT INTO feeling_tags (feeling_id, tag) VALUES (?, ?)', [feelingId, tag]);
    }
  }

  findByIdWithUser(feelingId) {
    return dbGet(`
      SELECT f.*, u.username, u.profile_image,
        (SELECT GROUP_CONCAT(tag, ',') FROM feeling_tags WHERE feeling_id = f.id) as tags_string
      FROM feelings f
      JOIN users u ON f.user_id = u.id
      WHERE f.id = ?
    `, [feelingId]);
  }

  findById(feelingId) {
    return dbGet('SELECT * FROM feelings WHERE id = ?', [feelingId]);
  }

  delete(feelingId) {
    dbRun('DELETE FROM feeling_tags WHERE feeling_id = ?', [feelingId]);
    dbRun('DELETE FROM feelings WHERE id = ?', [feelingId]);
    return true;
  }

  update(feelingId, text) {
    return dbRun('UPDATE feelings SET text = ? WHERE id = ?', [text, feelingId]);
  }

  deleteTags(feelingId) {
    return dbRun('DELETE FROM feeling_tags WHERE feeling_id = ?', [feelingId]);
  }

  findLike(feelingId, userId) {
    return dbGet('SELECT * FROM feeling_likes WHERE feeling_id = ? AND user_id = ?', [feelingId, userId]);
  }

  insertLike(feelingId, userId) {
    return dbRun('INSERT INTO feeling_likes (feeling_id, user_id) VALUES (?, ?)', [feelingId, userId]);
  }

  deleteLike(feelingId, userId) {
    return dbRun('DELETE FROM feeling_likes WHERE feeling_id = ? AND user_id = ?', [feelingId, userId]);
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

  deleteByContentId(contentId) {
    dbRun('DELETE FROM feeling_tags WHERE feeling_id IN (SELECT id FROM feelings WHERE content_id = ?)', [contentId]);
    return dbRun('DELETE FROM feelings WHERE content_id = ?', [contentId]);
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

module.exports = new FeelingsRepository();
