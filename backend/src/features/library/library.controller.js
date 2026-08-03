const libraryService = require('@/features/library/library.service');
const { successResponse, errorResponse } = require('@/shared/utils/response.helper');

class LibraryController {
  getUserLibrary(req, res) {
    try {
      const items = libraryService.getUserLibrary(req.user.id);
      return successResponse(res, items);
    } catch (err) {
      return errorResponse(res, err.message, 400);
    }
  }

  getStatus(req, res) {
    try {
      const { contentId } = req.params;
      const status = libraryService.getStatus(req.user.id, parseInt(contentId));
      return successResponse(res, { status });
    } catch (err) {
      return errorResponse(res, err.message, 400);
    }
  }

  upsert(req, res) {
    try {
      const { contentId } = req.params;
      const { status } = req.body;
      const result = libraryService.upsert(req.user.id, parseInt(contentId), status);
      return successResponse(res, result, 'Kütüphaneye eklendi/güncellendi.');
    } catch (err) {
      return errorResponse(res, err.message, 400);
    }
  }

  remove(req, res) {
    try {
      const { contentId } = req.params;
      libraryService.remove(req.user.id, parseInt(contentId));
      return successResponse(res, null, 'Kütüphaneden kaldırıldı.');
    } catch (err) {
      return errorResponse(res, err.message, 400);
    }
  }
}

module.exports = new LibraryController();
