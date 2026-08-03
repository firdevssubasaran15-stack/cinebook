const express = require('express');
const router = express.Router();
const feelingsController = require('@/features/feelings/feelings.controller');
const { authenticateToken } = require('@/shared/middleware/auth.middleware');

// GET /api/feelings/search?tag=nostalji&type=movie
router.get('/search', authenticateToken, (req, res) => feelingsController.searchByTag(req, res));

// GET /api/feelings/:contentId
router.get('/:contentId', authenticateToken, (req, res) => feelingsController.getByContentId(req, res));

// POST /api/feelings/:contentId
router.post('/:contentId', authenticateToken, (req, res) => feelingsController.create(req, res));

// DELETE /api/feelings/:id
router.delete('/:id', authenticateToken, (req, res) => feelingsController.delete(req, res));

// PUT /api/feelings/:id
router.put('/:id', authenticateToken, (req, res) => feelingsController.update(req, res));

// POST /api/feelings/:feelingId/like
router.post('/:feelingId/like', authenticateToken, (req, res) => feelingsController.toggleLike(req, res));

module.exports = router;
