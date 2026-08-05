const { dbQuery, dbGet } = require('@/database/db');

class NotificationJobRepository {
  getUsersWithNotificationsEnabled() {
    return dbQuery("SELECT id, notification_interval FROM users WHERE notifications_enabled = 1");
  }

  getLastSystemQuoteNotification(userId) {
    return dbGet(
      "SELECT created_at FROM notifications WHERE user_id = ? AND type = 'system_quote' ORDER BY created_at DESC LIMIT 1",
      [userId]
    );
  }

  getTopEmotionLast7Days(userId) {
    return dbGet(`
      SELECT t.tag, COUNT(*) as count
      FROM feelings f
      JOIN feeling_tags t ON f.id = t.feeling_id
      WHERE f.user_id = ? AND f.created_at >= datetime('now', '-7 days')
      GROUP BY t.tag
      ORDER BY count DESC, f.created_at DESC
      LIMIT 1
    `, [userId]);
  }

  getSuggestedQuote(userId, tag) {
    return dbGet(`
      SELECT com.id, com.quote, u.username, c.title, c.id as content_id
      FROM comments com
      JOIN users u ON com.user_id = u.id
      JOIN content c ON com.content_id = c.id
      JOIN feelings f ON f.content_id = c.id
      JOIN feeling_tags ft ON ft.feeling_id = f.id
      WHERE com.quote IS NOT NULL 
        AND com.quote != ''
        AND com.user_id != ?
        AND ft.tag = ?
        AND c.id NOT IN (SELECT content_id FROM comments WHERE user_id = ?)
        AND c.id NOT IN (SELECT content_id FROM library WHERE user_id = ?)
      ORDER BY RANDOM()
      LIMIT 1
    `, [userId, tag, userId, userId]);
  }
}

module.exports = new NotificationJobRepository();
