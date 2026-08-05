const { dbQuery, dbGet, dbRun } = require('@/database/db');

class ContentRepository {
  getLatestByTypeWithComments(type, limit = 50) {
    return dbQuery(`
      SELECT c.*,
        (SELECT text FROM comments WHERE content_id = c.id ORDER BY created_at DESC LIMIT 1) as latest_comment,
        (SELECT COUNT(*) FROM comments WHERE content_id = c.id) as comment_count
      FROM content c
      WHERE c.type = ?
      ORDER BY c.created_at DESC
      LIMIT ?
    `, [type, limit]);
  }

  getUndiscoveredByTag(userId, tag, type = null) {
    let typeFilter = '';
    const params = [tag, userId];
    if (type) {
      typeFilter = 'AND c.type = ?';
      params.push(type);
    }

    return dbQuery(`
      SELECT DISTINCT c.*,
        (SELECT COUNT(*) FROM comments WHERE content_id = c.id) as comment_count
      FROM content c
      JOIN feelings f ON c.id = f.content_id
      JOIN feeling_tags ft ON f.id = ft.feeling_id
      WHERE ft.tag = ?
      AND c.id NOT IN (
        SELECT content_id FROM library 
        WHERE user_id = ? AND status IN ('read', 'watched', 'watching', 'reading')
      )
      ${typeFilter}
      ORDER BY (SELECT COUNT(*) FROM feelings WHERE content_id = c.id) DESC
      LIMIT 20
    `, params);
  }

  getMostCommentedRecent(type, limit = 5) {
    return dbQuery(`
      SELECT c.*,
        (SELECT text FROM comments WHERE content_id = c.id ORDER BY created_at DESC LIMIT 1) as latest_comment,
        (SELECT COUNT(*) FROM comments WHERE content_id = c.id) as comment_count
      FROM content c
      WHERE c.type = ?
      ORDER BY (SELECT MAX(created_at) FROM comments WHERE content_id = c.id) DESC
      LIMIT ?
    `, [type, limit]);
  }

  searchByType(type, searchWord) {
    return dbQuery(
      `SELECT * FROM content WHERE type = ? AND (title LIKE ? OR director_author LIKE ?) ORDER BY created_at DESC`,
      [type, `%${searchWord}%`, `%${searchWord}%`]
    );
  }

  getByType(type) {
    return dbQuery('SELECT * FROM content WHERE type = ? ORDER BY created_at DESC', [type]);
  }

  findById(id) {
    return dbGet('SELECT * FROM content WHERE id = ?', [id]);
  }

  findDuplicate(type, title, directorAuthor, excludeId = null) {
    if (excludeId) {
      return dbGet(
        'SELECT id FROM content WHERE type = ? AND LOWER(title) = LOWER(?) AND LOWER(director_author) = LOWER(?) AND id != ?',
        [type, title, directorAuthor, excludeId]
      );
    }
    return dbGet(
      'SELECT id FROM content WHERE type = ? AND LOWER(title) = LOWER(?) AND LOWER(director_author) = LOWER(?)',
      [type, title, directorAuthor]
    );
  }

  insert(type, title, directorAuthor, summary, coverImage) {
    return dbRun(
      'INSERT INTO content (type, title, director_author, summary, cover_image) VALUES (?, ?, ?, ?, ?)',
      [type, title, directorAuthor, summary, coverImage]
    );
  }

  update(id, title, directorAuthor, summary, coverImage) {
    return dbRun(
      'UPDATE content SET title = ?, director_author = ?, summary = ?, cover_image = ? WHERE id = ?',
      [title, directorAuthor, summary, coverImage, id]
    );
  }

  delete(id) {
    return dbRun('DELETE FROM content WHERE id = ?', [id]);
  }
}

module.exports = new ContentRepository();
