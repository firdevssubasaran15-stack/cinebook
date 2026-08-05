const EventEmitter = require('events');
const notificationsService = require('@/features/notifications/notifications.service');

class UsersEvents extends EventEmitter {
  constructor() {
    super();
    this.setupListeners();
  }

  setupListeners() {
    this.on('USER_FOLLOWED', this.handleUserFollowed.bind(this));
  }

  handleUserFollowed({ followerId, followingId, followerUsername }) {
    if (followerUsername) {
      notificationsService.createNotification(
        followingId,
        'follow',
        `@${followerUsername} seni takip etmeye başladı.`,
        followerId
      );
    }
  }
}

module.exports = new UsersEvents();
