const notificationsRepository = require('./notifications.repository');

class NotificationsService {
  async getNotifications(userId) {
    const user = notificationsRepository.getUserNotificationSettings(userId);
    const interval = user ? user.notification_interval : 'hourly';

    let orderByClause = '';

    if (interval === 'hourly' || interval === 'daily') {
      orderByClause = `
        CASE 
          WHEN type IN ('follow', 'reply') THEN 1
          WHEN type = 'quote' THEN 2
          ELSE 3
        END ASC, created_at DESC
      `;
    } else {
      orderByClause = `
        CASE 
          WHEN type = 'quote' THEN 1
          ELSE 2
        END ASC, created_at DESC
      `;
    }

    return notificationsRepository.getNotifications(userId, orderByClause);
  }

  async getUnreadCount(userId) {
    return notificationsRepository.getUnreadCount(userId);
  }

  async createNotification(userId, type, message, relatedEntityId = null) {
    const user = notificationsRepository.getUserNotificationSettings(userId);
    
    if (!user || user.notifications_enabled === 0) {
      return null;
    }

    const result = notificationsRepository.insert(userId, type, message, relatedEntityId);
    return result.lastInsertRowid;
  }

  async markAsRead(notificationId, userId) {
    notificationsRepository.markAsRead(notificationId, userId);
    return true;
  }

  async markAllAsRead(userId) {
    notificationsRepository.markAllAsRead(userId);
    return true;
  }

  async broadcastNotification(message) {
    const users = notificationsRepository.getUsersWithNotificationsEnabled();
    let count = 0;
    
    for (const user of users) {
      notificationsRepository.insertBroadcast(user.id, message);
      count++;
    }
    
    return count;
  }
}

module.exports = new NotificationsService();
