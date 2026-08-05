const { dbQuery, dbGet, dbRun } = require('@/database/db');

class CommentsRepository {
  findByContentId(contentId, currentUserId) {
    return dbQuery(`
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
    `, [currentUserId, currentUserId, contentId]);
  }

  findByUserId(userId, currentUserId) {
    return dbQuery(`
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
    `, [currentUserId, currentUserId, userId]);
  }

  getFeed(currentUserId, limit) {
    return dbQuery(`
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
    `, [currentUserId, currentUserId, limit]);
  }

  findById(commentId) {
    return dbGet('SELECT * FROM comments WHERE id = ?', [commentId]);
  }

  findByIdWithUser(commentId) {
    return dbGet(`
      SELECT c.*, u.username, u.profile_image
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.id = ?
    `, [commentId]);
  }

  getUserByCommentId(commentId) {
    return dbGet('SELECT user_id FROM comments WHERE id = ?', [commentId]);
  }

  insert(userId, contentId, text, quote, parentId) {
    return dbRun(
      'INSERT INTO comments (user_id, content_id, text, quote, parent_id) VALUES (?, ?, ?, ?, ?)',
      [userId, contentId, text, quote, parentId]
    );
  }

  delete(commentId) {
    return dbRun('DELETE FROM comments WHERE id = ?', [commentId]);
  }

  update(commentId, text, quote) {
    return dbRun('UPDATE comments SET text = ?, quote = ? WHERE id = ?', [text, quote, commentId]);
  }

  getCommentStats(commentId) {
    return dbGet(`
      SELECT 
        (SELECT COUNT(*) FROM comment_likes WHERE comment_id = ?) as like_count,
        (SELECT COUNT(*) FROM comment_dislikes WHERE comment_id = ?) as dislike_count
    `, [commentId, commentId]);
  }

  findLike(commentId, userId) {
    return dbGet('SELECT * FROM comment_likes WHERE comment_id = ? AND user_id = ?', [commentId, userId]);
  }

  findDislike(commentId, userId) {
    return dbGet('SELECT * FROM comment_dislikes WHERE comment_id = ? AND user_id = ?', [commentId, userId]);
  }

  insertLike(commentId, userId) {
    return dbRun('INSERT INTO comment_likes (comment_id, user_id) VALUES (?, ?)', [commentId, userId]);
  }

  deleteLike(commentId, userId) {
    return dbRun('DELETE FROM comment_likes WHERE comment_id = ? AND user_id = ?', [commentId, userId]);
  }

  insertDislike(commentId, userId) {
    return dbRun('INSERT INTO comment_dislikes (comment_id, user_id) VALUES (?, ?)', [commentId, userId]);
  }

  deleteDislike(commentId, userId) {
    return dbRun('DELETE FROM comment_dislikes WHERE comment_id = ? AND user_id = ?', [commentId, userId]);
  }
  
  getLikeCount(commentId) {
    return dbGet('SELECT COUNT(*) as count FROM comment_likes WHERE comment_id = ?', [commentId]).count;
  }

  deleteByContentId(contentId) {
    dbRun('DELETE FROM comment_likes WHERE comment_id IN (SELECT id FROM comments WHERE content_id = ?)', [contentId]);
    dbRun('DELETE FROM comment_dislikes WHERE comment_id IN (SELECT id FROM comments WHERE content_id = ?)', [contentId]);
    return dbRun('DELETE FROM comments WHERE content_id = ?', [contentId]);
  }
}

module.exports = new CommentsRepository();
