const express = require('express');
const router = express.Router();
const authController = require('@/features/auth/auth.controller');
const authMiddleware = require('@/shared/middleware/auth.middleware');

// POST /api/auth/register
router.post('/register', (req, res) => authController.register(req, res));

// POST /api/auth/login
router.post('/login', (req, res) => authController.login(req, res));

// PUT /api/auth/theme
router.put('/theme', authMiddleware.authenticateToken, (req, res) => authController.updateTheme(req, res));

module.exports = router;
