const { dbQuery, dbRun, dbGet } = require('../../database/db');

class NotificationsService {
  async getNotifications(userId) {
    const user = dbGet('SELECT notification_interval FROM users WHERE id = ?', [userId]);
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

    const notifications = dbQuery(
      `SELECT * FROM notifications 
       WHERE user_id = ? 
       ORDER BY ${orderByClause} 
       LIMIT 50`,
      [userId]
    );
    return notifications;
  }

  async getUnreadCount(userId) {
    const result = dbGet(
      `SELECT COUNT(*) as count FROM notifications 
       WHERE user_id = ? AND is_read = 0`,
      [userId]
    );
    return result ? result.count : 0;
  }

  async createNotification(userId, type, message, relatedEntityId = null) {
    // Check if user has notifications enabled
    const user = dbGet('SELECT notifications_enabled FROM users WHERE id = ?', [userId]);
    
    if (!user || user.notifications_enabled === 0) {
      return null; // Notifications are disabled for this user
    }

    const result = dbRun(
      `INSERT INTO notifications (user_id, type, message, related_entity_id) 
       VALUES (?, ?, ?, ?)`,
      [userId, type, message, relatedEntityId]
    );
    
    return result.lastInsertRowid;
  }

  async markAsRead(notificationId, userId) {
    dbRun(
      `UPDATE notifications 
       SET is_read = 1 
       WHERE id = ? AND user_id = ?`,
      [notificationId, userId]
    );
    return true;
  }

  async markAllAsRead(userId) {
    dbRun(
      `UPDATE notifications 
       SET is_read = 1 
       WHERE user_id = ? AND is_read = 0`,
      [userId]
    );
    return true;
  }

  async broadcastNotification(message) {
    // Sadece bildirimleri açık olan kullanıcıları al
    const users = dbQuery('SELECT id FROM users WHERE notifications_enabled = 1');
    let count = 0;
    
    // SQLite allows multi-insert, but for simplicity we iterate.
    for (const user of users) {
      dbRun(
        `INSERT INTO notifications (user_id, type, message) VALUES (?, ?, ?)`,
        [user.id, 'system_broadcast', message]
      );
      count++;
    }
    
    return count;
  }
}

module.exports = new NotificationsService();
