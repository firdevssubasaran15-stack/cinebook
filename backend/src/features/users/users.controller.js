const usersService = require('@/features/users/users.service');
const commentsService = require('@/features/comments/comments.service');
const { successResponse, errorResponse } = require('@/shared/utils/response.helper');
const { catchError } = require('@/shared/utils/controller.wrapper');

class UsersController {
  getProfile = catchError((req, res) => {
    const { id } = req.params;
    const currentUserId = req.user ? req.user.id : null;
    const profile = usersService.getProfile(parseInt(id), currentUserId);
    return successResponse(res, profile);
  }, 404);

  getFollowers = catchError((req, res) => {
    const { id } = req.params;
    const followers = usersService.getFollowers(parseInt(id));
    return successResponse(res, followers);
  });

  getFollowing = catchError((req, res) => {
    const { id } = req.params;
    const following = usersService.getFollowing(parseInt(id));
    return successResponse(res, following);
  });

  getUserComments = catchError((req, res) => {
    const { id } = req.params;
    const currentUserId = req.user ? req.user.id : null;
    const comments = commentsService.getByUserId(parseInt(id), currentUserId);
    return successResponse(res, comments);
  });

  toggleFollow = catchError((req, res) => {
    const { id } = req.params;
    const currentUserId = req.user.id;
    const result = usersService.toggleFollow(currentUserId, parseInt(id));
    return successResponse(res, result, result.following ? 'Takip edildi.' : 'Takipten çıkıldı.');
  });

  _getProfileImagePath(file) {
    return `/uploads/profiles/${file.filename}`;
  }

  updateProfileImage = catchError((req, res) => {
    if (!req.file) {
      return errorResponse(res, 'Resim dosyası yüklenmedi.', 400);
    }
    
    const currentUserId = req.user.id;
    const imagePath = this._getProfileImagePath(req.file);
    
    const updatedUser = usersService.updateProfileImage(currentUserId, imagePath);
    
    return successResponse(res, updatedUser, 'Profil resmi başarıyla güncellendi.');
  });

  updateUsername = catchError((req, res) => {
    const { username } = req.body;
    const currentUserId = req.user.id;
    
    const updatedUser = usersService.updateUsername(currentUserId, username);
    
    return successResponse(res, updatedUser, 'Kullanıcı adı başarıyla değiştirildi.');
  });

  searchUsers = catchError((req, res) => {
    const { q } = req.query;
    const users = usersService.searchUsers(q);
    return successResponse(res, users);
  });

  updateNotificationSettings = catchError((req, res) => {
    const { enabled, interval } = req.body;
    const currentUserId = req.user.id;
    
    const updatedUser = usersService.updateNotificationSettings(currentUserId, enabled, interval);
    
    return successResponse(res, updatedUser, 'Bildirim ayarları güncellendi.');
  });

  getTopEmotions = catchError((req, res) => {
    const currentUserId = req.user.id;
    const tags = usersService.getTopEmotions(currentUserId, 5);
    return successResponse(res, tags);
  });
}

module.exports = new UsersController();
