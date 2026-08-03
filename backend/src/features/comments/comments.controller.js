const commentsService = require('@/features/comments/comments.service');
const { successResponse, errorResponse } = require('@/shared/utils/response.helper');

class CommentsController {
  async getByContentId(req, res) {
    try {
      const { contentId } = req.params;
      const userId = req.user ? req.user.id : null;
      const comments = commentsService.getByContentId(parseInt(contentId), userId);
      return successResponse(res, comments);
    } catch (err) {
      return errorResponse(res, err.message, 400);
    }
  }

  async getFeed(req, res) {
    try {
      const userId = req.user ? req.user.id : null;
      const limit = parseInt(req.query.limit) || 20;
      const comments = commentsService.getFeed(userId, limit);
      return successResponse(res, comments);
    } catch (err) {
      return errorResponse(res, err.message, 400);
    }
  }

  create(req, res) {
    try {
      const { text, quote, parent_id } = req.body;
      const data = commentsService.create(req.user.id, parseInt(req.params.contentId), text, quote, parent_id);
      return successResponse(res, data, 'Yorum eklendi.', 201);
    } catch (err) {
      return errorResponse(res, err.message, 400);
    }
  }

  delete(req, res) {
    try {
      commentsService.delete(parseInt(req.params.commentId), req.user.id, req.user.is_admin);
      return successResponse(res, null, 'Yorum silindi.');
    } catch (err) {
      return errorResponse(res, err.message, 403);
    }
  }

  update(req, res) {
    try {
      const { text, quote } = req.body;
      const data = commentsService.update(parseInt(req.params.commentId), req.user.id, text, quote);
      return successResponse(res, null, 'Yorum güncellendi.');
    } catch (err) {
      return errorResponse(res, err.message, 400);
    }
  }

  async toggleLike(req, res) {
    try {
      const { commentId } = req.params;
      const userId = req.user.id;
      const result = commentsService.toggleLike(parseInt(commentId), userId);
      return successResponse(res, result, result.liked ? 'Yorum beğenildi.' : 'Beğeni geri alındı.');
    } catch (err) {
      return errorResponse(res, err.message, 400);
    }
  }

  async toggleDislike(req, res) {
    try {
      const { commentId } = req.params;
      const userId = req.user.id;
      const result = commentsService.toggleDislike(parseInt(commentId), userId);
      return successResponse(res, result, result.disliked ? 'Yorum beğenilmedi.' : 'Beğenmeme geri alındı.');
    } catch (err) {
      return errorResponse(res, err.message, 400);
    }
  }
}

module.exports = new CommentsController();
