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
        JSON.stringify({ key: 'notifications.reply', username: `@${replier.username}` }),
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
        JSON.stringify({ key: 'notifications.comment_liked', username: `@${liker.username}`, count: totalLikes }),
        commentId
      );
    }
  }
});

module.exports = commentEvents;
