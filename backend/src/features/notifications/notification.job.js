const { dbQuery, dbGet } = require('@/database/db');
const notificationsService = require('./notifications.service');

const INTERVAL_MS = 60 * 1000; // Check every minute

class NotificationJob {
  start() {
    console.log('⏳ Notification Job started (Smart Quotes)');
    setInterval(() => this.processSmartQuotes(), INTERVAL_MS);
  }

  processSmartQuotes() {
    try {
      // 1. Tüm bildirimleri açık olan kullanıcıları çek
      const users = dbQuery("SELECT id, notification_interval FROM users WHERE notifications_enabled = 1");

      for (const user of users) {
        this.processUser(user);
      }
    } catch (err) {
      console.error('Notification Job Error:', err);
    }
  }

  processUser(user) {
    // interval süresi dolmuş mu kontrol et
    const lastNotif = dbGet(
      "SELECT created_at FROM notifications WHERE user_id = ? AND type = 'system_quote' ORDER BY created_at DESC LIMIT 1",
      [user.id]
    );

    if (lastNotif) {
      // created_at is likely 'YYYY-MM-DD HH:MM:SS', SQLite datetime('now') returns UTC
      const lastDate = new Date(lastNotif.created_at + 'Z').getTime();
      const now = Date.now();
      const diff = now - lastDate;

      // Saat, Gün, Hafta, Ay ms cinsinden
      let requiredDiff = 60 * 60 * 1000; // default hourly
      switch (user.notification_interval) {
        case 'hourly': requiredDiff = 60 * 60 * 1000; break;
        case 'daily': requiredDiff = 24 * 60 * 60 * 1000; break;
        case 'weekly': requiredDiff = 7 * 24 * 60 * 60 * 1000; break;
        case 'monthly': requiredDiff = 30 * 24 * 60 * 60 * 1000; break;
      }

      if (diff < requiredDiff) return; // Henüz zamanı gelmemiş
    }

    // 2. Kullanıcının son 7 gündeki en yoğun duygusunu bul
    const topEmotion = dbGet(`
      SELECT t.tag, COUNT(*) as count
      FROM feelings f
      JOIN feeling_tags t ON f.id = t.feeling_id
      WHERE f.user_id = ? AND f.created_at >= datetime('now', '-7 days')
      GROUP BY t.tag
      ORDER BY count DESC, f.created_at DESC
      LIMIT 1
    `, [user.id]);

    if (!topEmotion) return; // Duygu yoksa alıntı tavsiyesi atma

    // 3. Kullanıcının yorum yapmadığı ve kütüphanesine eklemediği içerikler arasından, 
    // bu duygu etiketine sahip içerikleri ve onlara yapılan alıntılı yorumları bul.
    const suggestedQuote = dbGet(`
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
    `, [user.id, topEmotion.tag, user.id, user.id]);

    if (suggestedQuote) {
      // Duygu etiketlerini kullanıcı dostu hale getir
      const duygu = topEmotion.tag.replace('_', ' '); 
      const message = `Geçen haftaki yoğun '${duygu}' duyguna özel tavsiye! @${suggestedQuote.username} kişisinden '${suggestedQuote.title}' için bir alıntı: "${suggestedQuote.quote}"`;
      
      notificationsService.createNotification(
        user.id,
        'system_quote',
        message,
        suggestedQuote.content_id
      );
    }
  }
}

module.exports = new NotificationJob();
