const { dbQuery, dbGet, dbRun } = require('@/database/db');

class SharedListContentsRepository {
  getListContents(listId) {
    return dbQuery(`
      SELECT c.*, slc.added_by, u.username as added_by_username
      FROM shared_list_contents slc
      JOIN content c ON slc.content_id = c.id
      JOIN users u ON slc.added_by = u.id
      WHERE slc.list_id = ?
      ORDER BY slc.created_at DESC
    `, [listId]);
  }

  findListContent(listId, contentId) {
    return dbGet('SELECT * FROM shared_list_contents WHERE list_id = ? AND content_id = ?', [listId, contentId]);
  }

  insertListContent(listId, contentId, userId) {
    return dbRun('INSERT INTO shared_list_contents (list_id, content_id, added_by) VALUES (?, ?, ?)', [listId, contentId, userId]);
  }
}

module.exports = new SharedListContentsRepository();
