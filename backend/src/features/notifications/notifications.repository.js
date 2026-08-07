const { dbQuery, dbGet, dbRun } = require('../../database/db');

class NotificationsRepository {
  getUserNotificationSettings(userId) {
    return dbGet('SELECT notification_interval, notifications_enabled FROM users WHERE id = ?', [userId]);
  }

  getNotifications(userId, orderByClause) {
    return dbQuery(
      `SELECT * FROM notifications 
       WHERE user_id = ? 
       ORDER BY ${orderByClause} 
       LIMIT 50`,
      [userId]
    );
  }

  getUnreadCount(userId) {
    const result = dbGet(
      `SELECT COUNT(*) as count FROM notifications 
       WHERE user_id = ? AND is_read = 0`,
      [userId]
    );
    return result ? result.count : 0;
  }

  insert(userId, type, message, relatedEntityId = null) {
    return dbRun(
      `INSERT INTO notifications (user_id, type, message, related_entity_id) 
       VALUES (?, ?, ?, ?)`,
      [userId, type, message, relatedEntityId]
    );
  }

  markAsRead(notificationId, userId) {
    return dbRun(
      `UPDATE notifications 
       SET is_read = 1 
       WHERE id = ? AND user_id = ?`,
      [notificationId, userId]
    );
  }

  markAllAsRead(userId) {
    return dbRun(
      `UPDATE notifications 
       SET is_read = 1 
       WHERE user_id = ? AND is_read = 0`,
      [userId]
    );
  }

  getUsersWithNotificationsEnabled() {
    return dbQuery('SELECT id FROM users WHERE notifications_enabled = 1');
  }

  insertBroadcast(userId, message) {
    return dbRun(
      `INSERT INTO notifications (user_id, type, message) VALUES (?, ?, ?)`,
      [userId, 'system_broadcast', message]
    );
  }

  savePushToken(userId, token) {
    // Insert or ignore if exists (UNIQUE constraint on user_id + token)
    return dbRun(
      `INSERT OR IGNORE INTO user_push_tokens (user_id, token) VALUES (?, ?)`,
      [userId, token]
    );
  }

  getUserPushTokens(userId) {
    return dbQuery('SELECT token FROM user_push_tokens WHERE user_id = ?', [userId]);
  }

  getAllPushTokens() {
    return dbQuery('SELECT user_id, token FROM user_push_tokens');
  }

  getInactiveUsers(hours) {
    return dbQuery(
      `SELECT id, username FROM users 
       WHERE last_active_at IS NOT NULL 
       AND datetime(last_active_at) <= datetime('now', '-' || ? || ' hours')
       AND notifications_enabled = 1`,
      [hours]
    );
  }
}

module.exports = new NotificationsRepository();
