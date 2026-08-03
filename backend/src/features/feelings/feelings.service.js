const { dbQuery, dbGet, dbRun } = require('@/database/db');
const { VALID_TAGS } = require('./feelings.constants');

class FeelingsService {
  getByContentId(contentId, currentUserId = null) {
    const feelings = dbQuery(`
      SELECT 
        f.*, 
        u.username,
        u.profile_image,
        (SELECT COUNT(*) FROM feeling_likes WHERE feeling_id = f.id) as like_count,
        (SELECT COUNT(*) FROM feeling_likes WHERE feeling_id = f.id AND user_id = ?) as is_liked_by_user
      FROM feelings f
      JOIN users u ON f.user_id = u.id
      WHERE f.content_id = ?
      ORDER BY f.created_at DESC
    `, [currentUserId || -1, contentId]);

    return feelings.map((feeling) => ({
      ...feeling,
      tags: dbQuery('SELECT tag FROM feeling_tags WHERE feeling_id = ?', [feeling.id]).map((t) => t.tag),
    }));
  }

  searchByTag(tag, contentType = null) {
    if (!VALID_TAGS.includes(tag)) {
      throw new Error(`Geçersiz etiket. Geçerli etiketler: ${VALID_TAGS.join(', ')}`);
    }

    let query = `
      SELECT DISTINCT f.*, u.username, u.profile_image, c.title, c.type, c.cover_image
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

    const feelings = dbQuery(query, params);
    return feelings.map((feeling) => ({
      ...feeling,
      tags: dbQuery('SELECT tag FROM feeling_tags WHERE feeling_id = ?', [feeling.id]).map((t) => t.tag),
    }));
  }

  create(userId, contentId, text, tags = []) {
    const priv = dbGet('SELECT can_post_feelings FROM user_privileges WHERE user_id = ?', [userId]);
    if (priv && !priv.can_post_feelings) {
      throw new Error('"Bana Hissettirdikleri" paylaşma yetkiniz bulunmuyor.');
    }

    if ((!text || text.trim().length === 0) && (!tags || tags.length === 0)) {
      throw new Error('İçerik boş olamaz, en az bir etiket seçmelisiniz veya bir metin girmelisiniz.');
    }

    const invalidTags = tags.filter((t) => !VALID_TAGS.includes(t));
    if (invalidTags.length > 0) {
      throw new Error(`Geçersiz etiketler: ${invalidTags.join(', ')}`);
    }

    const result = dbRun(
      'INSERT INTO feelings (user_id, content_id, text) VALUES (?, ?, ?)',
      [userId, contentId, text ? text.trim() : '']
    );

    const feelingId = result.lastInsertRowid;

    for (const tag of tags) {
      dbRun('INSERT INTO feeling_tags (feeling_id, tag) VALUES (?, ?)', [feelingId, tag]);
    }

    const feeling = dbGet(`
      SELECT f.*, u.username, u.profile_image FROM feelings f
      JOIN users u ON f.user_id = u.id
      WHERE f.id = ?
    `, [feelingId]);

    return {
      ...feeling,
      tags: dbQuery('SELECT tag FROM feeling_tags WHERE feeling_id = ?', [feelingId]).map((t) => t.tag),
    };
  }
  delete(feelingId, userId, isAdmin) {
    const feeling = dbGet('SELECT * FROM feelings WHERE id = ?', [feelingId]);
    if (!feeling) throw new Error('His bulunamadı.');
    
    let isModerator = isAdmin;
    if (!isAdmin) {
      const priv = dbGet('SELECT can_moderate_content FROM user_privileges WHERE user_id = ?', [userId]);
      isModerator = priv && priv.can_moderate_content === 1;
    }

    if (!isModerator && feeling.user_id !== userId) {
      throw new Error('Bu hissi silme yetkiniz yok.');
    }

    // SQLite FOREIGN KEY CASCADE aktifse (PRAGMA foreign_keys = ON) tags otomatik silinir, 
    // ama manuel silmek daha güvenli
    dbRun('DELETE FROM feeling_tags WHERE feeling_id = ?', [feelingId]);
    dbRun('DELETE FROM feelings WHERE id = ?', [feelingId]);
    
    return true;
  }

  update(feelingId, userId, text, tags = []) {
    if ((!text || text.trim().length === 0) && (!tags || tags.length === 0)) {
      throw new Error('İçerik boş olamaz, en az bir etiket seçmelisiniz veya bir metin girmelisiniz.');
    }

    const invalidTags = tags.filter((t) => !VALID_TAGS.includes(t));
    if (invalidTags.length > 0) {
      throw new Error(`Geçersiz etiketler: ${invalidTags.join(', ')}`);
    }

    const feeling = dbGet('SELECT * FROM feelings WHERE id = ?', [feelingId]);
    if (!feeling) throw new Error('His bulunamadı.');

    if (feeling.user_id !== userId) {
      throw new Error('Sadece kendi hissinizi düzenleyebilirsiniz.');
    }

    dbRun('UPDATE feelings SET text = ? WHERE id = ?', [text ? text.trim() : '', feelingId]);

    // Update tags
    dbRun('DELETE FROM feeling_tags WHERE feeling_id = ?', [feelingId]);
    for (const tag of tags) {
      dbRun('INSERT INTO feeling_tags (feeling_id, tag) VALUES (?, ?)', [feelingId, tag]);
    }

    const updatedFeeling = dbGet(`
      SELECT f.*, u.username, u.profile_image FROM feelings f
      JOIN users u ON f.user_id = u.id
      WHERE f.id = ?
    `, [feelingId]);

    return {
      ...updatedFeeling,
      tags: dbQuery('SELECT tag FROM feeling_tags WHERE feeling_id = ?', [feelingId]).map((t) => t.tag),
    };
  }

  toggleLike(feelingId, userId) {
    const feeling = dbGet('SELECT * FROM feelings WHERE id = ?', [feelingId]);
    if (!feeling) throw new Error('His bulunamadı.');

    const existingLike = dbGet('SELECT * FROM feeling_likes WHERE feeling_id = ? AND user_id = ?', [feelingId, userId]);

    if (existingLike) {
      dbRun('DELETE FROM feeling_likes WHERE feeling_id = ? AND user_id = ?', [feelingId, userId]);
      return { liked: false };
    } else {
      dbRun('INSERT INTO feeling_likes (feeling_id, user_id) VALUES (?, ?)', [feelingId, userId]);
      return { liked: true };
    }
  }
}

module.exports = new FeelingsService();
