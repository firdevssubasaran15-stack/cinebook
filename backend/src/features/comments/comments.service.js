const commentsRepository = require('./comments.repository');
const usersService = require('@/features/users/users.service');
const notificationsService = require('@/features/notifications/notifications.service');

class CommentsService {
  _calculateSentiment(comment) {
    const likes = comment.like_count || 0;
    const dislikes = comment.dislike_count || 0;
    const total = likes + dislikes;
    const score = total === 0 ? 0 : (likes - dislikes) / total;
    return { ...comment, sentiment_score: score };
  }

  getByContentId(contentId, currentUserId = null) {
    const results = commentsRepository.findByContentId(contentId, currentUserId || -1);
    return results.map(comment => this._calculateSentiment(comment));
  }

  getByUserId(userId, currentUserId = null) {
    const results = commentsRepository.findByUserId(userId, currentUserId || -1);
    return results.map(comment => this._calculateSentiment(comment));
  }

  getFeed(currentUserId = null, limit = 20) {
    const results = commentsRepository.getFeed(currentUserId || -1, limit);
    return results.map(comment => this._calculateSentiment(comment));
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

    // Yanıt ise bildirim gönder
    if (parentId) {
      const parentComment = commentsRepository.getUserByCommentId(parentId);
      if (parentComment && parentComment.user_id !== userId) {
        const replier = usersService.getUsername(userId);
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

    const comment = commentsRepository.findByIdWithUser(result.lastInsertRowid);
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
    const stats = commentsRepository.getCommentStats(commentId);

    const likes = stats.like_count || 0;
    const dislikes = stats.dislike_count || 0;
    const total = likes + dislikes;
    const score = total === 0 ? 0 : (likes - dislikes) / total;

    return { ...updatedComment, like_count: likes, dislike_count: dislikes, sentiment_score: score };
  }

  toggleLike(commentId, userId) {
    const comment = commentsRepository.findById(commentId);
    if (!comment) throw new Error('Yorum bulunamadı.');

    const existingLike = commentsRepository.findLike(commentId, userId);

    if (existingLike) {
      commentsRepository.deleteLike(commentId, userId);
      return { liked: false };
    } else {
      // Eğer dislike varsa onu sil
      commentsRepository.deleteDislike(commentId, userId);
      commentsRepository.insertLike(commentId, userId);
      
      // Bildirim gönder
      if (comment.user_id !== userId) { // Kendi yorumunu beğendiyse bildirim atma
        const liker = usersService.getUsername(userId);
        const totalLikes = commentsRepository.getLikeCount(commentId);
        
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
    const comment = commentsRepository.findById(commentId);
    if (!comment) throw new Error('Yorum bulunamadı.');

    const existingDislike = commentsRepository.findDislike(commentId, userId);

    if (existingDislike) {
      commentsRepository.deleteDislike(commentId, userId);
      return { disliked: false };
    } else {
      // Eğer like varsa onu sil
      commentsRepository.deleteLike(commentId, userId);
      commentsRepository.insertDislike(commentId, userId);
      return { disliked: true };
    }
  }

  deleteByContentId(contentId) {
    return commentsRepository.deleteByContentId(contentId);
  }
}

module.exports = new CommentsService();
