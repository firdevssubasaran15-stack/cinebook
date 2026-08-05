const notificationJobRepository = require('./notification-job.repository');
const notificationsService = require('./notifications.service');

const INTERVAL_MS = 60 * 1000; // Check every minute

class NotificationJob {
  start() {
    console.log('⏳ Notification Job started (Smart Quotes)');
    setInterval(() => this.processSmartQuotes(), INTERVAL_MS);
  }

  processSmartQuotes() {
    try {
      const users = notificationJobRepository.getUsersWithNotificationsEnabled();

      for (const user of users) {
        this.processUser(user);
      }
    } catch (err) {
      console.error('Notification Job Error:', err);
    }
  }

  processUser(user) {
    const lastNotif = notificationJobRepository.getLastSystemQuoteNotification(user.id);

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

    const topEmotion = notificationJobRepository.getTopEmotionLast7Days(user.id);

    if (!topEmotion) return; // Duygu yoksa alıntı tavsiyesi atma

    const suggestedQuote = notificationJobRepository.getSuggestedQuote(user.id, topEmotion.tag);

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
