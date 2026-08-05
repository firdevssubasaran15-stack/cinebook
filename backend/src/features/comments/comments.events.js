const EventEmitter = require('events');
const notificationsService = require('@/features/notifications/notifications.service');
const usersService = require('@/features/users/users.service');

class CommentEmitter extends EventEmitter {}
const commentEvents = new CommentEmitter();

// Yorum yanıtlandığında bildirim gönder
commentEvents.on('COMMENT_REPLIED', ({ parentComment, userId, commentId }) => {
  if (parentComment && parentComment.user_id !== userId) {
    const replier = usersService.getUsername(userId);
    if (replier) {
      notificationsService.createNotification(
        parentComment.user_id,
        'reply',
        `@${replier.username} yorumunuza cevap verdi.`,
        commentId
      );
    }
  }
});

// Yorum beğenildiğinde bildirim gönder
commentEvents.on('COMMENT_LIKED', ({ comment, userId, totalLikes, commentId }) => {
  if (comment.user_id !== userId) {
    const liker = usersService.getUsername(userId);
    if (liker) {
      notificationsService.createNotification(
        comment.user_id,
        'comment_like',
        `@${liker.username} yorumunu beğendi. (Toplam beğeni: ${totalLikes})`,
        commentId
      );
    }
  }
});

module.exports = commentEvents;
