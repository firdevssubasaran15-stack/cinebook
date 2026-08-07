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

// POST /api/auth/forgot-password
router.post('/forgot-password', (req, res) => authController.forgotPassword(req, res));

// POST /api/auth/verify-otp
router.post('/verify-otp', (req, res) => authController.verifyOtp(req, res));

// POST /api/auth/reset-password
router.post('/reset-password', (req, res) => authController.resetPassword(req, res));

module.exports = router;
