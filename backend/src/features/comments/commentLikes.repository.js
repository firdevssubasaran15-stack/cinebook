const { dbQuery, dbGet, dbRun } = require('@/database/db');

class CommentLikesRepository {
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
    const result = dbGet('SELECT COUNT(*) as count FROM comment_likes WHERE comment_id = ?', [commentId]);
    return result ? result.count : 0;
  }

  deleteByContentId(contentId) {
    dbRun('DELETE FROM comment_likes WHERE comment_id IN (SELECT id FROM comments WHERE content_id = ?)', [contentId]);
    dbRun('DELETE FROM comment_dislikes WHERE comment_id IN (SELECT id FROM comments WHERE content_id = ?)', [contentId]);
  }
}

module.exports = new CommentLikesRepository();
