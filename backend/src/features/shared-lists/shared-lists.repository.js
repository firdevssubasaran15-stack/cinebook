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

  findMember(listId, userId) {
    return dbGet("SELECT * FROM shared_list_members WHERE list_id = ? AND user_id = ? AND status = 'accepted'", [listId, userId]);
  }
  
  findAnyMemberStatus(listId, userId) {
    return dbGet("SELECT * FROM shared_list_members WHERE list_id = ? AND user_id = ?", [listId, userId]);
  }

  findPendingMember(listId, userId) {
    return dbGet("SELECT * FROM shared_list_members WHERE list_id = ? AND user_id = ? AND status = 'pending'", [listId, userId]);
  }

  getListMembers(listId) {
    return dbQuery(`
      SELECT u.id, u.username, u.profile_image, slm.status, slm.created_at
      FROM shared_list_members slm
      JOIN users u ON slm.user_id = u.id
      WHERE slm.list_id = ?
    `, [listId]);
  }

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

  findSavedList(listId, userId) {
    return dbGet('SELECT id FROM saved_shared_lists WHERE list_id = ? AND user_id = ?', [listId, userId]);
  }

  insertMemberPending(listId, userId) {
    return dbRun("INSERT INTO shared_list_members (list_id, user_id, status) VALUES (?, ?, 'pending')", [listId, userId]);
  }

  updateMemberAccepted(listId, userId) {
    return dbRun("UPDATE shared_list_members SET status = 'accepted' WHERE list_id = ? AND user_id = ?", [listId, userId]);
  }

  deletePendingMember(listId, userId) {
    return dbRun("DELETE FROM shared_list_members WHERE list_id = ? AND user_id = ? AND status = 'pending'", [listId, userId]);
  }

  findListContent(listId, contentId) {
    return dbGet('SELECT * FROM shared_list_contents WHERE list_id = ? AND content_id = ?', [listId, contentId]);
  }

  insertListContent(listId, contentId, userId) {
    return dbRun('INSERT INTO shared_list_contents (list_id, content_id, added_by) VALUES (?, ?, ?)', [listId, contentId, userId]);
  }

  getPendingInvitations(userId) {
    return dbQuery(`
      SELECT sl.id, sl.name, sl.type, u.username as owner_username
      FROM shared_list_members slm
      JOIN shared_lists sl ON slm.list_id = sl.id
      JOIN users u ON sl.owner_id = u.id
      WHERE slm.user_id = ? AND slm.status = 'pending'
      ORDER BY slm.created_at DESC
    `, [userId]);
  }

  updateListVisibility(listId, isPublic) {
    return dbRun('UPDATE shared_lists SET is_public = ? WHERE id = ?', [isPublic, listId]);
  }

  insertSavedList(listId, userId) {
    return dbRun('INSERT INTO saved_shared_lists (user_id, list_id) VALUES (?, ?)', [userId, listId]);
  }

  deleteSavedList(listId, userId) {
    return dbRun('DELETE FROM saved_shared_lists WHERE user_id = ? AND list_id = ?', [userId, listId]);
  }
}

module.exports = new SharedListsRepository();
