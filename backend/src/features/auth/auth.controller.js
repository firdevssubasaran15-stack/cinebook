const authService = require('@/features/auth/auth.service');
const { successResponse, errorResponse } = require('@/shared/utils/response.helper');

class AuthController {
  async register(req, res) {
    try {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        return errorResponse(res, 'Kullanıcı adı, e-posta ve şifre zorunludur.', 400);
      }

      if (password.length < 6) {
        return errorResponse(res, 'Şifre en az 6 karakter olmalıdır.', 400);
      }

      const result = authService.register(username, email, password);
      return successResponse(res, result, 'Kayıt başarılı.', 201);
    } catch (err) {
      return errorResponse(res, err.message, 400);
    }
  }

  async login(req, res) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return errorResponse(res, 'Kullanıcı adı ve şifre zorunludur.', 400);
      }

      const result = authService.login(username, password);
      return successResponse(res, result, 'Giriş başarılı.');
    } catch (err) {
      return errorResponse(res, err.message, 401);
    }
  }

  async updateTheme(req, res) {
    try {
      const { theme } = req.body;
      const userId = req.user.id;

      if (!theme) {
        return errorResponse(res, 'Tema zorunludur.', 400);
      }

      const result = authService.updateTheme(userId, theme);
      return successResponse(res, result, 'Tema güncellendi.');
    } catch (err) {
      return errorResponse(res, err.message, 400);
    }
  }
}

module.exports = new AuthController();
