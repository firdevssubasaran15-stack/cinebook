const express = require('express');
const router = express.Router();
const commentsController = require('@/features/comments/comments.controller');
const { authenticateToken } = require('@/shared/middleware/auth.middleware');

// GET /api/comments/feed/latest
router.get('/feed/latest', authenticateToken, (req, res) => commentsController.getFeed(req, res));

// GET /api/comments/:contentId
router.get('/:contentId', authenticateToken, (req, res) => commentsController.getByContentId(req, res));

// POST /api/comments/:contentId
router.post('/:contentId', authenticateToken, (req, res) => commentsController.create(req, res));

// DELETE /api/comments/:commentId
router.delete('/:commentId', authenticateToken, (req, res) => commentsController.delete(req, res));

// PUT /api/comments/:commentId
router.put('/:commentId', authenticateToken, (req, res) => commentsController.update(req, res));

// POST /api/comments/:commentId/like
router.post('/:commentId/like', authenticateToken, (req, res) => commentsController.toggleLike(req, res));

// POST /api/comments/:commentId/dislike
router.post('/:commentId/dislike', authenticateToken, (req, res) => commentsController.toggleDislike(req, res));

module.exports = router;
