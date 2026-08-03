const feelingsService = require('@/features/feelings/feelings.service');
const { successResponse, errorResponse } = require('@/shared/utils/response.helper');

class FeelingsController {
  async getByContentId(req, res) {
    try {
      const { contentId } = req.params;
      const userId = req.user ? req.user.id : null;
      const feelings = feelingsService.getByContentId(parseInt(contentId), userId);
      return successResponse(res, feelings);
    } catch (err) {
      return errorResponse(res, err.message, 400);
    }
  }

  searchByTag(req, res) {
    try {
      const { tag, type } = req.query;
      if (!tag) return errorResponse(res, 'Etiket parametresi gerekli.', 400);
      const data = feelingsService.searchByTag(tag, type || null);
      return successResponse(res, data);
    } catch (err) {
      return errorResponse(res, err.message, 400);
    }
  }

  create(req, res) {
    try {
      const { text, tags } = req.body;
      const data = feelingsService.create(
        req.user.id,
        parseInt(req.params.contentId),
        text,
        Array.isArray(tags) ? tags : []
      );
      return successResponse(res, data, '"Bana Hissettirdikleri" paylaşıldı.', 201);
    } catch (err) {
      return errorResponse(res, err.message, 400);
    }
  }

  delete(req, res) {
    try {
      const isAdmin = req.user.is_admin === 1;
      feelingsService.delete(parseInt(req.params.id), req.user.id, isAdmin);
      return successResponse(res, null, 'His silindi.');
    } catch (err) {
      return errorResponse(res, err.message, 400);
    }
  }

  update(req, res) {
    try {
      const { text, tags } = req.body;
      const data = feelingsService.update(
        parseInt(req.params.id),
        req.user.id,
        text,
        Array.isArray(tags) ? tags : []
      );
      return successResponse(res, data, 'His güncellendi.');
    } catch (err) {
      return errorResponse(res, err.message, 400);
    }
  }

  async toggleLike(req, res) {
    try {
      const { feelingId } = req.params;
      const userId = req.user.id;
      const result = feelingsService.toggleLike(parseInt(feelingId), userId);
      return successResponse(res, result, result.liked ? 'His beğenildi.' : 'Beğeni geri alındı.');
    } catch (err) {
      return errorResponse(res, err.message, 400);
    }
  }
}

module.exports = new FeelingsController();
