const { dbQuery, dbGet, dbRun } = require('@/database/db');

class SharedListMembersRepository {
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

  insertMemberPending(listId, userId) {
    return dbRun("INSERT INTO shared_list_members (list_id, user_id, status) VALUES (?, ?, 'pending')", [listId, userId]);
  }

  updateMemberAccepted(listId, userId) {
    return dbRun("UPDATE shared_list_members SET status = 'accepted' WHERE list_id = ? AND user_id = ?", [listId, userId]);
  }

  deletePendingMember(listId, userId) {
    return dbRun("DELETE FROM shared_list_members WHERE list_id = ? AND user_id = ? AND status = 'pending'", [listId, userId]);
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
}

module.exports = new SharedListMembersRepository();
