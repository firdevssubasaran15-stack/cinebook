const express = require('express');
const router = express.Router();
const usersController = require('@/features/users/users.controller');
const { authenticateToken, optionalAuth } = require('@/shared/middleware/auth.middleware');
const { uploadProfile } = require('@/shared/middleware/upload.middleware');

// GET /api/users/search
router.get('/search', optionalAuth, (req, res) => usersController.searchUsers(req, res));

// GET /api/users/:id/profile
router.get('/:id/profile', optionalAuth, (req, res) => usersController.getProfile(req, res));

// GET /api/users/:id/comments
router.get('/:id/comments', optionalAuth, (req, res) => usersController.getUserComments(req, res));

// GET /api/users/:id/followers
router.get('/:id/followers', optionalAuth, (req, res) => usersController.getFollowers(req, res));

// GET /api/users/:id/following
router.get('/:id/following', optionalAuth, (req, res) => usersController.getFollowing(req, res));

// POST /api/users/:id/follow
router.post('/:id/follow', authenticateToken, (req, res) => usersController.toggleFollow(req, res));

// PUT /api/users/profile-image
router.put('/profile-image', authenticateToken, uploadProfile.single('image'), (req, res) => usersController.updateProfileImage(req, res));

// PUT /api/users/username
router.put('/username', authenticateToken, (req, res) => usersController.updateUsername(req, res));

// PUT /api/users/settings/notifications
router.put('/settings/notifications', authenticateToken, (req, res) => usersController.updateNotificationSettings(req, res));

// GET /api/users/me/top-emotions
router.get('/me/top-emotions', authenticateToken, (req, res) => usersController.getTopEmotions(req, res));

module.exports = router;
