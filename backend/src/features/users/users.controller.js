const usersService = require('@/features/users/users.service');
const commentsService = require('@/features/comments/comments.service');
const { successResponse, errorResponse } = require('@/shared/utils/response.helper');

class UsersController {
  getProfile(req, res) {
    try {
      const { id } = req.params;
      const currentUserId = req.user ? req.user.id : null;
      const profile = usersService.getProfile(parseInt(id), currentUserId);
      return successResponse(res, profile);
    } catch (err) {
      return errorResponse(res, err.message, 404);
    }
  }

  getFollowers(req, res) {
    try {
      const { id } = req.params;
      const followers = usersService.getFollowers(parseInt(id));
      return successResponse(res, followers);
    } catch (err) {
      return errorResponse(res, err.message, 400);
    }
  }

  getFollowing(req, res) {
    try {
      const { id } = req.params;
      const following = usersService.getFollowing(parseInt(id));
      return successResponse(res, following);
    } catch (err) {
      return errorResponse(res, err.message, 400);
    }
  }

  getUserComments(req, res) {
    try {
      const { id } = req.params;
      const currentUserId = req.user ? req.user.id : null;
      const comments = commentsService.getByUserId(parseInt(id), currentUserId);
      return successResponse(res, comments);
    } catch (err) {
      return errorResponse(res, err.message, 400);
    }
  }

  toggleFollow(req, res) {
    try {
      const { id } = req.params;
      const currentUserId = req.user.id;
      const result = usersService.toggleFollow(currentUserId, parseInt(id));
      return successResponse(res, result, result.following ? 'Takip edildi.' : 'Takipten çıkıldı.');
    } catch (err) {
      return errorResponse(res, err.message, 400);
    }
  }

  _getProfileImagePath(file) {
    return `/uploads/profiles/${file.filename}`;
  }

  updateProfileImage(req, res) {
    try {
      if (!req.file) {
        return errorResponse(res, 'Resim dosyası yüklenmedi.', 400);
      }
      
      const currentUserId = req.user.id;
      const imagePath = this._getProfileImagePath(req.file);
      
      const updatedUser = usersService.updateProfileImage(currentUserId, imagePath);
      
      return successResponse(res, updatedUser, 'Profil resmi başarıyla güncellendi.');
    } catch (err) {
      return errorResponse(res, err.message, 400);
    }
  }

  updateUsername(req, res) {
    try {
      const { username } = req.body;
      const currentUserId = req.user.id;
      
      const updatedUser = usersService.updateUsername(currentUserId, username);
      
      return successResponse(res, updatedUser, 'Kullanıcı adı başarıyla değiştirildi.');
    } catch (err) {
      return errorResponse(res, err.message, 400);
    }
  }

  searchUsers(req, res) {
    try {
      const { q } = req.query;
      const users = usersService.searchUsers(q);
      return successResponse(res, users);
    } catch (err) {
      return errorResponse(res, err.message, 400);
    }
  }

  updateNotificationSettings(req, res) {
    try {
      const { enabled, interval } = req.body;
      const currentUserId = req.user.id;
      
      const updatedUser = usersService.updateNotificationSettings(currentUserId, enabled, interval);
      
      return successResponse(res, updatedUser, 'Bildirim ayarları güncellendi.');
    } catch (err) {
      return errorResponse(res, err.message, 400);
    }
  }

  getTopEmotions(req, res) {
    try {
      const currentUserId = req.user.id;
      const tags = usersService.getTopEmotions(currentUserId, 5);
      return successResponse(res, tags);
    } catch (err) {
      console.error('getTopEmotions error:', err);
      return errorResponse(res, err.message, 400);
    }
  }
}

module.exports = new UsersController();
