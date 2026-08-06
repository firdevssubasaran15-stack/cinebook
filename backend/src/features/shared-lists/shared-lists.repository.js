const { dbQuery, dbGet, dbRun } = require('@/database/db');

class SharedListsRepository {
  insertList(name, type, userId) {
    return dbRun('INSERT INTO shared_lists (name, type, owner_id, is_public) VALUES (?, ?, ?, 1)', [name, type, userId]);
  }

  getMyLists(userId) {
    return dbQuery(`
      SELECT sl.*, 
             (SELECT COUNT(*) FROM shared_list_members WHERE list_id = sl.id AND status = 'accepted') + 1 as member_count,
             (SELECT COUNT(*) FROM shared_list_contents WHERE list_id = sl.id) as content_count
      FROM shared_lists sl
      LEFT JOIN shared_list_members slm ON sl.id = slm.list_id
      LEFT JOIN saved_shared_lists ssl ON sl.id = ssl.list_id AND ssl.user_id = ?
      WHERE sl.owner_id = ? 
         OR (slm.user_id = ? AND slm.status = 'accepted')
         OR ssl.id IS NOT NULL
      GROUP BY sl.id
      ORDER BY sl.created_at DESC
    `, [userId, userId, userId]);
  }

  getUserPublicLists(userId) {
    return dbQuery(`
      SELECT sl.*, 
             (SELECT COUNT(*) FROM shared_list_members WHERE list_id = sl.id AND status = 'accepted') + 1 as member_count,
             (SELECT COUNT(*) FROM shared_list_contents WHERE list_id = sl.id) as content_count,
             u.username as owner_username,
             u.profile_image as owner_profile_image
      FROM shared_lists sl
      JOIN users u ON sl.owner_id = u.id
      WHERE sl.owner_id = ? AND sl.is_public = 1
      ORDER BY sl.created_at DESC
    `, [userId]);
  }

  findById(listId) {
    return dbGet('SELECT * FROM shared_lists WHERE id = ?', [listId]);
  }

  updateListVisibility(listId, isPublic) {
    return dbRun('UPDATE shared_lists SET is_public = ? WHERE id = ?', [isPublic, listId]);
  }
}

module.exports = new SharedListsRepository();
