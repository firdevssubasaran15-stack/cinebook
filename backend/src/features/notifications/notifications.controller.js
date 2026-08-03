const notificationsService = require('./notifications.service');

class NotificationsController {
  async getNotifications(req, res) {
    try {
      const userId = req.user.id;
      const notifications = await notificationsService.getNotifications(userId);
      res.json({ success: true, data: notifications });
    } catch (error) {
      console.error('Error fetching notifications:', error);
      res.status(500).json({ success: false, message: 'Sunucu hatası' });
    }
  }

  async getUnreadCount(req, res) {
    try {
      const userId = req.user.id;
      const count = await notificationsService.getUnreadCount(userId);
      res.json({ success: true, data: { count } });
    } catch (error) {
      console.error('Error fetching unread count:', error);
      res.status(500).json({ success: false, message: 'Sunucu hatası' });
    }
  }

  async markAsRead(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      await notificationsService.markAsRead(id, userId);
      res.json({ success: true, message: 'Bildirim okundu olarak işaretlendi' });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      res.status(500).json({ success: false, message: 'Sunucu hatası' });
    }
  }

  async markAllAsRead(req, res) {
    try {
      const userId = req.user.id;
      await notificationsService.markAllAsRead(userId);
      res.json({ success: true, message: 'Tüm bildirimler okundu olarak işaretlendi' });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      res.status(500).json({ success: false, message: 'Sunucu hatası' });
    }
  }
  async broadcast(req, res) {
    try {
      const { message } = req.body;
      if (!message || message.trim().length === 0) {
        return res.status(400).json({ success: false, message: 'Duyuru mesajı boş olamaz.' });
      }
      const count = await notificationsService.broadcastNotification(message.trim());
      res.json({ success: true, message: `${count} kullanıcıya duyuru gönderildi.` });
    } catch (error) {
      console.error('Error broadcasting notification:', error);
      res.status(500).json({ success: false, message: 'Sunucu hatası' });
    }
  }
}

module.exports = new NotificationsController();
