const express = require('express');
const router = express.Router();
const notificationsController = require('./notifications.controller');
const { authenticateToken, requireAdmin } = require('@/shared/middleware/auth.middleware');

router.use(authenticateToken);

router.get('/', notificationsController.getNotifications);
router.get('/unread-count', notificationsController.getUnreadCount);
router.put('/read-all', notificationsController.markAllAsRead);
router.put('/:id/read', notificationsController.markAsRead);
router.post('/broadcast', requireAdmin, notificationsController.broadcast);

module.exports = router;
