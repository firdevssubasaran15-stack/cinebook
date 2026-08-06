const commentsRepository = require('./comments.repository');
const commentLikesRepository = require('./commentLikes.repository');
const usersService = require('@/features/users/users.service');
const commentEvents = require('./comments.events');
const SentimentUtils = require('./sentiment.utils');

class CommentsService {
  getByContentId(contentId, currentUserId = null) {
    const results = commentsRepository.findByContentId(contentId, currentUserId || -1);
    return results.map(comment => SentimentUtils.attachSentiment(comment));
  }

  getByUserId(userId, currentUserId = null) {
    const results = commentsRepository.findByUserId(userId, currentUserId || -1);
    return results.map(comment => SentimentUtils.attachSentiment(comment));
  }

  getFeed(currentUserId = null, limit = 20) {
    const results = commentsRepository.getFeed(currentUserId || -1, limit);
    return results.map(comment => SentimentUtils.attachSentiment(comment));
  }

  create(userId, contentId, text, quote, parentId = null) {
    const priv = usersService.getUserPrivileges(userId);
    if (priv && !priv.can_comment) {
      throw new Error('Yorum yapma yetkiniz bulunmuyor.');
    }

    if (!text || text.trim().length === 0) {
      throw new Error('Yorum boş olamaz.');
    }

    const trimmedText = text.trim();
    const trimmedQuote = quote ? quote.trim() : null;

    const result = commentsRepository.insert(userId, contentId, trimmedText, trimmedQuote, parentId);
    const commentId = result.lastInsertRowid;

    // Yanıt ise bildirim eventi fırlat
    if (parentId) {
      const parentComment = commentsRepository.getUserByCommentId(parentId);
      commentEvents.emit('COMMENT_REPLIED', { parentComment, userId, commentId });
    }

    const comment = commentsRepository.findByIdWithUser(commentId);
    return { ...comment, sentiment_score: 0, like_count: 0, dislike_count: 0 };
  }

  delete(commentId, userId, isAdmin) {
    const comment = commentsRepository.findById(commentId);
    if (!comment) throw new Error('Yorum bulunamadı.');
    
    let isModerator = isAdmin;
    if (!isAdmin) {
      const priv = usersService.getUserPrivileges(userId);
      isModerator = priv && priv.can_moderate_content === 1;
    }

    if (!isModerator && comment.user_id !== userId) {
      throw new Error('Bu yorumu silme yetkiniz yok.');
    }
    commentsRepository.delete(commentId);
    return true;
  }

  update(commentId, userId, text, quote) {
    if (!text || text.trim().length === 0) {
      throw new Error('Yorum boş olamaz.');
    }

    const comment = commentsRepository.findById(commentId);
    if (!comment) throw new Error('Yorum bulunamadı.');

    if (comment.user_id !== userId) {
      throw new Error('Sadece kendi yorumunuzu düzenleyebilirsiniz.');
    }

    const trimmedText = text.trim();
    const trimmedQuote = quote ? quote.trim() : null;

    commentsRepository.update(commentId, trimmedText, trimmedQuote);

    const updatedComment = commentsRepository.findByIdWithUser(commentId);
    const stats = commentLikesRepository.getCommentStats(commentId);

    return SentimentUtils.applyStatsAndSentiment(updatedComment, stats);
  }

  toggleLike(commentId, userId) {
    const comment = commentsRepository.findById(commentId);
    if (!comment) throw new Error('Yorum bulunamadı.');

    const existingLike = commentLikesRepository.findLike(commentId, userId);

    if (existingLike) {
      commentLikesRepository.deleteLike(commentId, userId);
      return { liked: false };
    } else {
      // Eğer dislike varsa onu sil
      commentLikesRepository.deleteDislike(commentId, userId);
      commentLikesRepository.insertLike(commentId, userId);
      
      // Bildirim event'i fırlat
      const totalLikes = commentLikesRepository.getLikeCount(commentId);
      commentEvents.emit('COMMENT_LIKED', { comment, userId, totalLikes, commentId });

      return { liked: true };
    }
  }

  toggleDislike(commentId, userId) {
    const comment = commentsRepository.findById(commentId);
    if (!comment) throw new Error('Yorum bulunamadı.');

    const existingDislike = commentLikesRepository.findDislike(commentId, userId);

    if (existingDislike) {
      commentLikesRepository.deleteDislike(commentId, userId);
      return { disliked: false };
    } else {
      // Eğer like varsa onu sil
      commentLikesRepository.deleteLike(commentId, userId);
      commentLikesRepository.insertDislike(commentId, userId);
      return { disliked: true };
    }
  }

  deleteByContentId(contentId) {
    commentLikesRepository.deleteByContentId(contentId);
    return commentsRepository.deleteByContentId(contentId);
  }
}

module.exports = new CommentsService();
