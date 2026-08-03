const { dbQuery, dbGet, dbRun } = require('@/database/db');
const notificationsService = require('@/features/notifications/notifications.service');

class CommentsService {
  getByContentId(contentId, currentUserId = null) {
    const results = dbQuery(`
      SELECT 
        c.*, 
        u.username,
        u.profile_image,
        (SELECT COUNT(*) FROM comment_likes WHERE comment_id = c.id) as like_count,
        (SELECT COUNT(*) FROM comment_likes WHERE comment_id = c.id AND user_id = ?) as is_liked_by_user,
        (SELECT COUNT(*) FROM comment_dislikes WHERE comment_id = c.id) as dislike_count,
        (SELECT COUNT(*) FROM comment_dislikes WHERE comment_id = c.id AND user_id = ?) as is_disliked_by_user
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.content_id = ?
      ORDER BY c.created_at DESC
    `, [currentUserId || -1, currentUserId || -1, contentId]);

    return results.map(comment => {
      const likes = comment.like_count || 0;
      const dislikes = comment.dislike_count || 0;
      const total = likes + dislikes;
      const score = total === 0 ? 0 : (likes - dislikes) / total;
      return { ...comment, sentiment_score: score };
    });
  }

  getByUserId(userId, currentUserId = null) {
    const results = dbQuery(`
      SELECT 
        c.*, 
        u.username,
        u.profile_image,
        ct.title as content_title,
        ct.type as content_type,
        ct.cover_image as content_cover_image,
        (SELECT COUNT(*) FROM comment_likes WHERE comment_id = c.id) as like_count,
        (SELECT COUNT(*) FROM comment_likes WHERE comment_id = c.id AND user_id = ?) as is_liked_by_user,
        (SELECT COUNT(*) FROM comment_dislikes WHERE comment_id = c.id) as dislike_count,
        (SELECT COUNT(*) FROM comment_dislikes WHERE comment_id = c.id AND user_id = ?) as is_disliked_by_user
      FROM comments c
      JOIN users u ON c.user_id = u.id
      JOIN content ct ON c.content_id = ct.id
      WHERE c.user_id = ?
      ORDER BY c.created_at DESC
    `, [currentUserId || -1, currentUserId || -1, userId]);

    return results.map(comment => {
      const likes = comment.like_count || 0;
      const dislikes = comment.dislike_count || 0;
      const total = likes + dislikes;
      const score = total === 0 ? 0 : (likes - dislikes) / total;
      return { ...comment, sentiment_score: score };
    });
  }

  getFeed(currentUserId = null, limit = 20) {
    const results = dbQuery(`
      SELECT 
        c.*, 
        u.username,
        u.profile_image,
        ct.title as content_title,
        ct.type as content_type,
        ct.cover_image as content_cover_image,
        (SELECT COUNT(*) FROM comment_likes WHERE comment_id = c.id) as like_count,
        (SELECT COUNT(*) FROM comment_likes WHERE comment_id = c.id AND user_id = ?) as is_liked_by_user,
        (SELECT COUNT(*) FROM comment_dislikes WHERE comment_id = c.id) as dislike_count,
        (SELECT COUNT(*) FROM comment_dislikes WHERE comment_id = c.id AND user_id = ?) as is_disliked_by_user
      FROM comments c
      JOIN users u ON c.user_id = u.id
      JOIN content ct ON c.content_id = ct.id
      ORDER BY c.created_at DESC
      LIMIT ?
    `, [currentUserId || -1, currentUserId || -1, limit]);

    return results.map(comment => {
      const likes = comment.like_count || 0;
      const dislikes = comment.dislike_count || 0;
      const total = likes + dislikes;
      const score = total === 0 ? 0 : (likes - dislikes) / total;
      return { ...comment, sentiment_score: score };
    });
  }

  create(userId, contentId, text, quote, parentId = null) {
    const priv = dbGet('SELECT can_comment FROM user_privileges WHERE user_id = ?', [userId]);
    if (priv && !priv.can_comment) {
      throw new Error('Yorum yapma yetkiniz bulunmuyor.');
    }

    if (!text || text.trim().length === 0) {
      throw new Error('Yorum boş olamaz.');
    }

    const result = dbRun(
      'INSERT INTO comments (user_id, content_id, text, quote, parent_id) VALUES (?, ?, ?, ?, ?)',
      [userId, contentId, text.trim(), quote ? quote.trim() : null, parentId]
    );

    // Yanıt ise bildirim gönder
    if (parentId) {
      const parentComment = dbGet('SELECT user_id FROM comments WHERE id = ?', [parentId]);
      if (parentComment && parentComment.user_id !== userId) {
        const replier = dbGet('SELECT username FROM users WHERE id = ?', [userId]);
        if (replier) {
          notificationsService.createNotification(
            parentComment.user_id,
            'reply',
            `@${replier.username} yorumunuza cevap verdi.`,
            result.lastInsertRowid
          );
        }
      }
    }

    const comment = dbGet(`
      SELECT c.*, u.username, u.profile_image
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.id = ?
    `, [result.lastInsertRowid]);
    
    return { ...comment, sentiment_score: 0, like_count: 0, dislike_count: 0 };
  }

  delete(commentId, userId, isAdmin) {
    const comment = dbGet('SELECT * FROM comments WHERE id = ?', [commentId]);
    if (!comment) throw new Error('Yorum bulunamadı.');
    
    let isModerator = isAdmin;
    if (!isAdmin) {
      const priv = dbGet('SELECT can_moderate_content FROM user_privileges WHERE user_id = ?', [userId]);
      isModerator = priv && priv.can_moderate_content === 1;
    }

    if (!isModerator && comment.user_id !== userId) {
      throw new Error('Bu yorumu silme yetkiniz yok.');
    }
    dbRun('DELETE FROM comments WHERE id = ?', [commentId]);
    return true;
  }

  update(commentId, userId, text, quote) {
    if (!text || text.trim().length === 0) {
      throw new Error('Yorum boş olamaz.');
    }

    const comment = dbGet('SELECT * FROM comments WHERE id = ?', [commentId]);
    if (!comment) throw new Error('Yorum bulunamadı.');

    if (comment.user_id !== userId) {
      throw new Error('Sadece kendi yorumunuzu düzenleyebilirsiniz.');
    }

    dbRun('UPDATE comments SET text = ?, quote = ? WHERE id = ?', [text.trim(), quote ? quote.trim() : null, commentId]);

    const updatedComment = dbGet(`
      SELECT c.*, u.username, u.profile_image 
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.id = ?
    `, [commentId]);

    const stats = dbGet(`
      SELECT 
        (SELECT COUNT(*) FROM comment_likes WHERE comment_id = ?) as like_count,
        (SELECT COUNT(*) FROM comment_dislikes WHERE comment_id = ?) as dislike_count
    `, [commentId, commentId]);

    const likes = stats.like_count || 0;
    const dislikes = stats.dislike_count || 0;
    const total = likes + dislikes;
    const score = total === 0 ? 0 : (likes - dislikes) / total;

    return { ...updatedComment, like_count: likes, dislike_count: dislikes, sentiment_score: score };
  }

  toggleLike(commentId, userId) {
    const comment = dbGet('SELECT * FROM comments WHERE id = ?', [commentId]);
    if (!comment) throw new Error('Yorum bulunamadı.');

    const existingLike = dbGet('SELECT * FROM comment_likes WHERE comment_id = ? AND user_id = ?', [commentId, userId]);

    if (existingLike) {
      dbRun('DELETE FROM comment_likes WHERE comment_id = ? AND user_id = ?', [commentId, userId]);
      return { liked: false };
    } else {
      // Eğer dislike varsa onu sil
      dbRun('DELETE FROM comment_dislikes WHERE comment_id = ? AND user_id = ?', [commentId, userId]);
      
      dbRun('INSERT INTO comment_likes (comment_id, user_id) VALUES (?, ?)', [commentId, userId]);
      
      // Bildirim gönder
      if (comment.user_id !== userId) { // Kendi yorumunu beğendiyse bildirim atma
        const liker = dbGet('SELECT username FROM users WHERE id = ?', [userId]);
        const totalLikes = dbGet('SELECT COUNT(*) as count FROM comment_likes WHERE comment_id = ?', [commentId]).count;
        
        if (liker) {
          notificationsService.createNotification(
            comment.user_id,
            'comment_like',
            `@${liker.username} yorumunu beğendi. (Toplam beğeni: ${totalLikes})`,
            commentId
          );
        }
      }

      return { liked: true };
    }
  }

  toggleDislike(commentId, userId) {
    const comment = dbGet('SELECT * FROM comments WHERE id = ?', [commentId]);
    if (!comment) throw new Error('Yorum bulunamadı.');

    const existingDislike = dbGet('SELECT * FROM comment_dislikes WHERE comment_id = ? AND user_id = ?', [commentId, userId]);

    if (existingDislike) {
      dbRun('DELETE FROM comment_dislikes WHERE comment_id = ? AND user_id = ?', [commentId, userId]);
      return { disliked: false };
    } else {
      // Eğer like varsa onu sil
      dbRun('DELETE FROM comment_likes WHERE comment_id = ? AND user_id = ?', [commentId, userId]);
      
      dbRun('INSERT INTO comment_dislikes (comment_id, user_id) VALUES (?, ?)', [commentId, userId]);
      
      // Dislike için de istenirse bildirim eklenebilir, ancak genelde dislike bildirimi moral bozucu olduğundan eklenmez.
      return { disliked: true };
    }
  }
}

module.exports = new CommentsService();
