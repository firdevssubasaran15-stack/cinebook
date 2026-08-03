const adminService = require('@/features/admin/admin.service');
const { successResponse, errorResponse } = require('@/shared/utils/response.helper');

class AdminController {
  getAllUsers(req, res) {
    try {
      const data = adminService.getAllUsers();
      return successResponse(res, data);
    } catch (err) {
      return errorResponse(res, err.message);
    }
  }

  searchUser(req, res) {
    try {
      const { username } = req.query;
      if (!username) return errorResponse(res, 'Username parametresi gerekli.', 400);
      const data = adminService.searchUser(username);
      return successResponse(res, data);
    } catch (err) {
      return errorResponse(res, err.message);
    }
  }

  updatePrivileges(req, res) {
    try {
      const userId = parseInt(req.params.id);
      const data = adminService.updatePrivileges(userId, req.body);
      return successResponse(res, data, 'Yetkiler güncellendi.');
    } catch (err) {
      return errorResponse(res, err.message, 400);
    }
  }
}

module.exports = new AdminController();
