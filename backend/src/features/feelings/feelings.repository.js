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
    dbRun('DELETE FROM feelings WHERE id = ?', [feelingId]);
    return true;
  }

  update(feelingId, text) {
    return dbRun('UPDATE feelings SET text = ? WHERE id = ?', [text, feelingId]);
  }

  deleteByContentId(contentId) {
    return dbRun('DELETE FROM feelings WHERE content_id = ?', [contentId]);
  }

}

module.exports = new FeelingsRepository();
