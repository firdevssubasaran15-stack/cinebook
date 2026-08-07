const notificationsRepository = require('./notifications.repository');
const { Expo } = require('expo-server-sdk');

let expo = new Expo();

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

  async savePushToken(userId, token) {
    if (!Expo.isExpoPushToken(token)) {
      console.error(`Push token ${token} is not a valid Expo push token`);
      return false;
    }
    notificationsRepository.savePushToken(userId, token);
    return true;
  }

  async _sendPushNotifications(userIds, title, body, data = {}) {
    let messages = [];
    
    for (const userId of userIds) {
      const tokens = notificationsRepository.getUserPushTokens(userId);
      for (let tokenRecord of tokens) {
        if (Expo.isExpoPushToken(tokenRecord.token)) {
          messages.push({
            to: tokenRecord.token,
            sound: 'default',
            title: title,
            body: body,
            data: data,
          });
        }
      }
    }

    let chunks = expo.chunkPushNotifications(messages);
    let tickets = [];
    (async () => {
      for (let chunk of chunks) {
        try {
          let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
          tickets.push(...ticketChunk);
        } catch (error) {
          console.error('Error sending push chunk:', error);
        }
      }
    })();
  }

  async createNotification(userId, type, message, relatedEntityId = null) {
    const user = notificationsRepository.getUserNotificationSettings(userId);
    
    if (!user || user.notifications_enabled === 0) {
      return null;
    }

    const result = notificationsRepository.insert(userId, type, message, relatedEntityId);
    
    // Send Push Notification
    this._sendPushNotifications([userId], 'CineBook', message, { type, relatedEntityId });

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
    let userIds = [];

    for (const user of users) {
      notificationsRepository.insertBroadcast(user.id, message);
      userIds.push(user.id);
      count++;
    }
    
    // Broadcast push notification
    if (userIds.length > 0) {
      this._sendPushNotifications(userIds, 'CineBook Duyuru', message);
    }
    
    return count;
  }
}

module.exports = new NotificationsService();
