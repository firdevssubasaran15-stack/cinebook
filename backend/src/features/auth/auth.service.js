const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authRepository = require('./auth.repository');

class AuthService {
  register(username, email, password) {
    // Şifre kısıtlamaları (Backend Güvenliği)
    if (!password || password.length < 8 || password.length > 12) {
      throw new Error('Şifre 8 ile 12 karakter arasında olmalıdır.');
    }
    if (!/[A-Z]/.test(password)) {
      throw new Error('Şifre en az 1 büyük harf içermelidir.');
    }
    if (!/[a-z]/.test(password)) {
      throw new Error('Şifre en az 1 küçük harf içermelidir.');
    }
    if (!/[0-9]/.test(password)) {
      throw new Error('Şifre en az 1 rakam içermelidir.');
    }
    if (!/[<>|!@#$%^&*()_+\-=\[\]{};':"\\,./?~`]/.test(password)) {
      throw new Error('Şifre en az 1 özel karakter içermelidir.');
    }

    const existing = authRepository.findUserByUsernameOrEmail(username, email);
    if (existing) {
      throw new Error('Bu kullanıcı adı veya e-posta zaten kullanılıyor.');
    }

    const passwordHash = bcrypt.hashSync(password, 12);
    const result = authRepository.insertUser(username, email, passwordHash);

    authRepository.insertUserPrivileges(result.lastInsertRowid);

    const user = authRepository.getUserAuthProfile(result.lastInsertRowid);
    const token = this._generateToken(user);
    return { user, token };
  }

  login(username, password) {
    const user = authRepository.findUserForLogin(username);
    if (!user) {
      throw new Error('Kullanıcı adı veya şifre hatalı.');
    }

    const isValid = bcrypt.compareSync(password, user.password_hash);
    if (!isValid) {
      throw new Error('Kullanıcı adı veya şifre hatalı.');
    }

    const privileges = authRepository.getUserPrivileges(user.id);

    const safeUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      is_admin: user.is_admin,
      theme_preference: user.theme_preference,
      profile_image: user.profile_image,
      notifications_enabled: user.notifications_enabled,
      notification_interval: user.notification_interval,
      privileges,
    };

    const token = this._generateToken(safeUser);
    return { user: safeUser, token };
  }

  _generateToken(user) {
    return jwt.sign(
      { id: user.id, username: user.username, is_admin: user.is_admin },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
  }

  updateTheme(userId, theme) {
    if (!['light', 'dark'].includes(theme)) {
      throw new Error('Geçersiz tema seçimi.');
    }
    authRepository.updateTheme(userId, theme);
    return { success: true, theme };
  }
}

module.exports = new AuthService();
