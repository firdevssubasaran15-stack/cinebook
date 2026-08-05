const contentService = require('@/features/content/content.service');
const { successResponse, errorResponse } = require('@/shared/utils/response.helper');

class ContentController {
  getRecommendations(req, res) {
    try {
      const { mood } = req.query;
      if (!mood) return errorResponse(res, 'Mood parametresi gereklidir.', 400);
      const data = contentService.getRecommendationsByMood(mood);
      return successResponse(res, data, 'Önerilen içerikler.');
    } catch (err) {
      return errorResponse(res, err.message);
    }
  }

  getUndiscoveredByMood(req, res) {
    try {
      const { mood } = req.params;
      const { type } = req.query;
      const currentUserId = req.user.id;
      if (!mood) return errorResponse(res, 'Mood parametresi gereklidir.', 400);
      const data = contentService.getUndiscoveredByMood(currentUserId, mood, type);
      return successResponse(res, data, 'Keşfedilmeyi bekleyen içerikler.');
    } catch (err) {
      return errorResponse(res, err.message);
    }
  }

  getLatest(req, res) {
    try {
      const data = contentService.getLatestByType();
      return successResponse(res, data, 'En son yorumlanan içerikler.');
    } catch (err) {
      return errorResponse(res, err.message);
    }
  }

  getByType(req, res) {
    try {
      const { type } = req.params;
      const { search } = req.query;
      const data = contentService.getByType(type, search || '');
      return successResponse(res, data);
    } catch (err) {
      return errorResponse(res, err.message);
    }
  }

  getById(req, res) {
    try {
      const data = contentService.getById(parseInt(req.params.id));
      return successResponse(res, data);
    } catch (err) {
      return errorResponse(res, err.message, 404);
    }
  }

  _getCoverImagePath(file) {
    return file ? `/uploads/${file.filename}` : null;
  }

  create(req, res) {
    try {
      const { type, title, director_author, summary } = req.body;
      const cover_image = this._getCoverImagePath(req.file);

      const data = contentService.create({ type, title, director_author, summary, cover_image });
      return successResponse(res, data, 'İçerik başarıyla eklendi.', 201);
    } catch (err) {
      return errorResponse(res, err.message, 400);
    }
  }

  update(req, res) {
    try {
      const { title, director_author, summary } = req.body;
      // update işleminde dosya gönderilmemişse mevcut resim korunmalıdır (undefined)
      const cover_image = req.file ? this._getCoverImagePath(req.file) : undefined;

      const data = contentService.update(parseInt(req.params.id), { title, director_author, summary, cover_image });
      return successResponse(res, data, 'İçerik başarıyla güncellendi.');
    } catch (err) {
      return errorResponse(res, err.message, 400);
    }
  }

  delete(req, res) {
    try {
      contentService.delete(parseInt(req.params.id));
      return successResponse(res, null, 'İçerik silindi.');
    } catch (err) {
      return errorResponse(res, err.message, 404);
    }
  }
}

module.exports = new ContentController();
