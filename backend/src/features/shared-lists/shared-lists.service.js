const { dbQuery, dbGet, dbRun } = require('@/database/db');

class SharedListsService {
  createList(userId, name, type) {
    if (!name || name.trim().length < 2) {
      throw new Error('Liste adı en az 2 karakter olmalıdır.');
    }
    if (type !== 'watching' && type !== 'reading') {
      throw new Error('Geçersiz liste türü.');
    }

    const result = dbRun('INSERT INTO shared_lists (name, type, owner_id, is_public) VALUES (?, ?, ?, 1)', [name.trim(), type, userId]);
    return { id: result.lastInsertRowid, name: name.trim(), type, owner_id: userId, is_public: 1 };
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

  getListDetails(listId, userId) {
    const list = dbGet('SELECT * FROM shared_lists WHERE id = ?', [listId]);
    if (!list) throw new Error('Liste bulunamadı.');

    // Yetki kontrolü
    if (list.owner_id !== userId) {
      if (list.is_public !== 1) {
        const member = dbGet("SELECT * FROM shared_list_members WHERE list_id = ? AND user_id = ? AND status = 'accepted'", [listId, userId]);
        if (!member) throw new Error('Bu listeyi görüntüleme yetkiniz yok.');
      }
    }

    // Üyeler
    const members = dbQuery(`
      SELECT u.id, u.username, u.profile_image, slm.status, slm.created_at
      FROM shared_list_members slm
      JOIN users u ON slm.user_id = u.id
      WHERE slm.list_id = ?
    `, [listId]);

    // Owner bilgisini de üyelere ekle
    const owner = dbGet('SELECT id, username, profile_image FROM users WHERE id = ?', [list.owner_id]);
    const allMembers = [{ ...owner, status: 'owner' }, ...members];

    // İçerikler
    const contents = dbQuery(`
      SELECT c.*, slc.added_by, u.username as added_by_username
      FROM shared_list_contents slc
      JOIN content c ON slc.content_id = c.id
      JOIN users u ON slc.added_by = u.id
      WHERE slc.list_id = ?
      ORDER BY slc.created_at DESC
    `, [listId]);

    const isSaved = dbGet('SELECT id FROM saved_shared_lists WHERE list_id = ? AND user_id = ?', [listId, userId]);

    return { ...list, members: allMembers, contents, is_saved_by_user: !!isSaved };
  }

  inviteUser(listId, ownerId, targetUserId) {
    const list = dbGet('SELECT * FROM shared_lists WHERE id = ?', [listId]);
    if (!list) throw new Error('Liste bulunamadı.');
    if (list.owner_id !== ownerId) throw new Error('Sadece liste sahibi davet gönderebilir.');
    if (ownerId === targetUserId) throw new Error('Kendinizi davet edemezsiniz.');

    const targetUser = dbGet('SELECT id FROM users WHERE id = ?', [targetUserId]);
    if (!targetUser) throw new Error('Davet edilecek kullanıcı bulunamadı.');

    const existing = dbGet('SELECT * FROM shared_list_members WHERE list_id = ? AND user_id = ?', [listId, targetUserId]);
    if (existing) {
      if (existing.status === 'accepted') throw new Error('Kullanıcı zaten bu listeye üye.');
      if (existing.status === 'pending') throw new Error('Kullanıcıya zaten davet gönderilmiş.');
    }

    dbRun("INSERT INTO shared_list_members (list_id, user_id, status) VALUES (?, ?, 'pending')", [listId, targetUserId]);
    return { success: true };
  }

  acceptInvite(listId, userId) {
    const existing = dbGet("SELECT * FROM shared_list_members WHERE list_id = ? AND user_id = ? AND status = 'pending'", [listId, userId]);
    if (!existing) throw new Error('Geçerli bir davet bulunamadı.');

    dbRun("UPDATE shared_list_members SET status = 'accepted' WHERE list_id = ? AND user_id = ?", [listId, userId]);
    return { success: true };
  }

  rejectInvite(listId, userId) {
    dbRun("DELETE FROM shared_list_members WHERE list_id = ? AND user_id = ? AND status = 'pending'", [listId, userId]);
    return { success: true };
  }

  addContent(listId, userId, contentId) {
    const list = dbGet('SELECT * FROM shared_lists WHERE id = ?', [listId]);
    if (!list) throw new Error('Liste bulunamadı.');

    if (list.owner_id !== userId) {
      const member = dbGet("SELECT * FROM shared_list_members WHERE list_id = ? AND user_id = ? AND status = 'accepted'", [listId, userId]);
      if (!member) throw new Error('Bu listeye içerik ekleme yetkiniz yok.');
    }

    const content = dbGet('SELECT id FROM content WHERE id = ?', [contentId]);
    if (!content) throw new Error('İçerik bulunamadı.');

    const existing = dbGet('SELECT * FROM shared_list_contents WHERE list_id = ? AND content_id = ?', [listId, contentId]);
    if (existing) throw new Error('Bu içerik zaten listede.');

    dbRun('INSERT INTO shared_list_contents (list_id, content_id, added_by) VALUES (?, ?, ?)', [listId, contentId, userId]);
    return { success: true };
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

  toggleVisibility(listId, userId) {
    const list = dbGet('SELECT * FROM shared_lists WHERE id = ?', [listId]);
    if (!list) throw new Error('Liste bulunamadı.');
    if (list.owner_id !== userId) throw new Error('Sadece liste sahibi bu ayarı değiştirebilir.');

    const newVisibility = list.is_public === 1 ? 0 : 1;
    dbRun('UPDATE shared_lists SET is_public = ? WHERE id = ?', [newVisibility, listId]);
    
    return { ...list, is_public: newVisibility };
  }

  saveList(listId, userId) {
    const list = dbGet('SELECT * FROM shared_lists WHERE id = ?', [listId]);
    if (!list) throw new Error('Liste bulunamadı.');
    if (list.is_public !== 1) throw new Error('Bu liste gizli, kaydedilemez.');
    if (list.owner_id === userId) throw new Error('Kendi listenizi kaydedemezsiniz.');
    
    const existing = dbGet('SELECT * FROM saved_shared_lists WHERE user_id = ? AND list_id = ?', [userId, listId]);
    if (existing) return { success: true };

    dbRun('INSERT INTO saved_shared_lists (user_id, list_id) VALUES (?, ?)', [userId, listId]);
    return { success: true };
  }

  unsaveList(listId, userId) {
    dbRun('DELETE FROM saved_shared_lists WHERE user_id = ? AND list_id = ?', [userId, listId]);
    return { success: true };
  }
}

module.exports = new SharedListsService();
