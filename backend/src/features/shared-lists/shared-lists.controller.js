const sharedListsService = require('./shared-lists.service');
const { successResponse } = require('@/shared/utils/response.helper');
const { catchError } = require('@/shared/utils/controller.wrapper');

class SharedListsController {
  createList = catchError((req, res) => {
    const { name, type } = req.body;
    const list = sharedListsService.createList(req.user.id, name, type);
    return successResponse(res, list, 'Liste başarıyla oluşturuldu.');
  });

  getMyLists = catchError((req, res) => {
    const lists = sharedListsService.getMyLists(req.user.id);
    return successResponse(res, lists);
  });

  getUserPublicLists = catchError((req, res) => {
    const { userId } = req.params;
    const lists = sharedListsService.getUserPublicLists(parseInt(userId));
    return successResponse(res, lists);
  });

  getListDetails = catchError((req, res) => {
    const { id } = req.params;
    const list = sharedListsService.getListDetails(parseInt(id), req.user.id);
    return successResponse(res, list);
  }, 403);

  inviteUser = catchError((req, res) => {
    const { id } = req.params;
    const { targetUserId } = req.body;
    const result = sharedListsService.inviteUser(parseInt(id), req.user.id, parseInt(targetUserId));
    return successResponse(res, result, 'Davet gönderildi.');
  });

  acceptInvite = catchError((req, res) => {
    const { id } = req.params;
    const result = sharedListsService.acceptInvite(parseInt(id), req.user.id);
    return successResponse(res, result, 'Davet kabul edildi.');
  });

  rejectInvite = catchError((req, res) => {
    const { id } = req.params;
    const result = sharedListsService.rejectInvite(parseInt(id), req.user.id);
    return successResponse(res, result, 'Davet reddedildi.');
  });

  addContent = catchError((req, res) => {
    const { id } = req.params;
    const { contentId } = req.body;
    const result = sharedListsService.addContent(parseInt(id), req.user.id, parseInt(contentId));
    return successResponse(res, result, 'İçerik listeye eklendi.');
  });

  getPendingInvitations = catchError((req, res) => {
    const invitations = sharedListsService.getPendingInvitations(req.user.id);
    return successResponse(res, invitations);
  });

  toggleVisibility = catchError((req, res) => {
    const { id } = req.params;
    const result = sharedListsService.toggleVisibility(parseInt(id), req.user.id);
    return successResponse(res, result, result.is_public ? 'Liste herkese açık yapıldı.' : 'Liste gizli yapıldı.');
  });

  saveList = catchError((req, res) => {
    const { id } = req.params;
    const result = sharedListsService.saveList(parseInt(id), req.user.id);
    return successResponse(res, result, 'Liste başarıyla kaydedildi.');
  });

  unsaveList = catchError((req, res) => {
    const { id } = req.params;
    const result = sharedListsService.unsaveList(parseInt(id), req.user.id);
    return successResponse(res, result, 'Liste kaydedilenlerden çıkarıldı.');
  });
}

module.exports = new SharedListsController();
