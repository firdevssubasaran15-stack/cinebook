const sharedListsService = require('./shared-lists.service');
const { successResponse, errorResponse } = require('@/shared/utils/response.helper');

class SharedListsController {
  createList(req, res) {
    try {
      const { name, type } = req.body;
      const list = sharedListsService.createList(req.user.id, name, type);
      return successResponse(res, list, 'Liste başarıyla oluşturuldu.');
    } catch (err) {
      console.error('Create list hatası:', err);
      return errorResponse(res, err.message, 400);
    }
  }

  getMyLists(req, res) {
    try {
      const lists = sharedListsService.getMyLists(req.user.id);
      return successResponse(res, lists);
    } catch (err) {
      return errorResponse(res, err.message, 400);
    }
  }

  getUserPublicLists(req, res) {
    try {
      const { userId } = req.params;
      const lists = sharedListsService.getUserPublicLists(parseInt(userId));
      return successResponse(res, lists);
    } catch (err) {
      return errorResponse(res, err.message, 400);
    }
  }

  getListDetails(req, res) {
    try {
      const { id } = req.params;
      const list = sharedListsService.getListDetails(parseInt(id), req.user.id);
      return successResponse(res, list);
    } catch (err) {
      return errorResponse(res, err.message, 403);
    }
  }

  inviteUser(req, res) {
    try {
      const { id } = req.params;
      const { targetUserId } = req.body;
      const result = sharedListsService.inviteUser(parseInt(id), req.user.id, parseInt(targetUserId));
      return successResponse(res, result, 'Davet gönderildi.');
    } catch (err) {
      return errorResponse(res, err.message, 400);
    }
  }

  acceptInvite(req, res) {
    try {
      const { id } = req.params;
      const result = sharedListsService.acceptInvite(parseInt(id), req.user.id);
      return successResponse(res, result, 'Davet kabul edildi.');
    } catch (err) {
      return errorResponse(res, err.message, 400);
    }
  }

  rejectInvite(req, res) {
    try {
      const { id } = req.params;
      const result = sharedListsService.rejectInvite(parseInt(id), req.user.id);
      return successResponse(res, result, 'Davet reddedildi.');
    } catch (err) {
      return errorResponse(res, err.message, 400);
    }
  }

  addContent(req, res) {
    try {
      const { id } = req.params;
      const { contentId } = req.body;
      const result = sharedListsService.addContent(parseInt(id), req.user.id, parseInt(contentId));
      return successResponse(res, result, 'İçerik listeye eklendi.');
    } catch (err) {
      return errorResponse(res, err.message, 400);
    }
  }

  getPendingInvitations(req, res) {
    try {
      const invitations = sharedListsService.getPendingInvitations(req.user.id);
      return successResponse(res, invitations);
    } catch (err) {
      return errorResponse(res, err.message, 400);
    }
  }

  toggleVisibility(req, res) {
    try {
      const { id } = req.params;
      const result = sharedListsService.toggleVisibility(parseInt(id), req.user.id);
      return successResponse(res, result, result.is_public ? 'Liste herkese açık yapıldı.' : 'Liste gizli yapıldı.');
    } catch (err) {
      return errorResponse(res, err.message, 400);
    }
  }

  saveList(req, res) {
    try {
      const { id } = req.params;
      const result = sharedListsService.saveList(parseInt(id), req.user.id);
      return successResponse(res, result, 'Liste başarıyla kaydedildi.');
    } catch (err) {
      return errorResponse(res, err.message, 400);
    }
  }

  unsaveList(req, res) {
    try {
      const { id } = req.params;
      const result = sharedListsService.unsaveList(parseInt(id), req.user.id);
      return successResponse(res, result, 'Liste kaydedilenlerden çıkarıldı.');
    } catch (err) {
      return errorResponse(res, err.message, 400);
    }
  }
}

module.exports = new SharedListsController();
