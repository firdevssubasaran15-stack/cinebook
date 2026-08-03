const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { dbGet, dbRun } = require('@/database/db');

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

    const existing = dbGet('SELECT id FROM users WHERE username = ? OR email = ?', [username, email]);
    if (existing) {
      throw new Error('Bu kullanıcı adı veya e-posta zaten kullanılıyor.');
    }

    const passwordHash = bcrypt.hashSync(password, 12);
    const result = dbRun(
      'INSERT INTO users (username, email, password_hash, is_admin) VALUES (?, ?, ?, 0)',
      [username, email, passwordHash]
    );

    dbRun(
      `INSERT INTO user_privileges (user_id, can_comment, can_post_feelings, can_view_movies, can_view_series, can_view_books, can_view_admin_panel, can_moderate_content)
       VALUES (?, 1, 1, 1, 1, 1, 0, 0)`,
      [result.lastInsertRowid]
    );

    const user = dbGet('SELECT id, username, email, is_admin, theme_preference, profile_image, notifications_enabled, notification_interval FROM users WHERE id = ?', [result.lastInsertRowid]);
    const token = this._generateToken(user);
    return { user, token };
  }

  login(username, password) {
    const user = dbGet('SELECT * FROM users WHERE username = ? OR email = ?', [username, username]);
    if (!user) {
      throw new Error('Kullanıcı adı veya şifre hatalı.');
    }

    const isValid = bcrypt.compareSync(password, user.password_hash);
    if (!isValid) {
      throw new Error('Kullanıcı adı veya şifre hatalı.');
    }

    const privileges = dbGet('SELECT * FROM user_privileges WHERE user_id = ?', [user.id]);

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
    dbRun('UPDATE users SET theme_preference = ? WHERE id = ?', [theme, userId]);
    return { success: true, theme };
  }
}

module.exports = new AuthService();
