const express = require('express');
const router = express.Router();
const adminController = require('@/features/admin/admin.controller');
const { authenticateToken } = require('@/shared/middleware/auth.middleware');
const { requireAdmin } = require('@/shared/middleware/admin.middleware');

// Tüm admin route'ları hem auth hem admin middleware gerektirir
router.use(authenticateToken, requireAdmin);

// GET /api/admin/users
router.get('/users', (req, res) => adminController.getAllUsers(req, res));

// GET /api/admin/users/search?username=xxx
router.get('/users/search', (req, res) => adminController.searchUser(req, res));

// PUT /api/admin/users/:id/privileges
router.put('/users/:id/privileges', (req, res) => adminController.updatePrivileges(req, res));

module.exports = router;
