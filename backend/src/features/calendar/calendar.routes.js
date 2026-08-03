const express = require('express');
const router = express.Router();
const calendarController = require('./calendar.controller');
const { authenticateToken } = require('@/shared/middleware/auth.middleware');

router.use(authenticateToken); // Takvim için giriş zorunlu

// GET /api/calendar
router.get('/', (req, res) => calendarController.getHistory(req, res));

module.exports = router;
