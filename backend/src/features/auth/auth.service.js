const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const authRepository = require('./auth.repository');

// Configure mail transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: process.env.SMTP_PORT || 587,
  auth: {
    user: process.env.SMTP_USER || 'ethereal.user@ethereal.email',
    pass: process.env.SMTP_PASS || 'etherealpass'
  }
});

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
      process.env.JWT_SECRET || 'secret',
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

  // --- PASSWORD RESET ---
  async requestPasswordReset(username, email) {
    // KVKK: Her zaman aynı cevabı döner
    const successMsg = 'Eğer bu bilgilere sahip bir hesap varsa, şifre sıfırlama kodu gönderilmiştir.';
    
    const user = authRepository.findUserByUsernameAndEmail(username, email);
    if (!user) {
      return { message: successMsg };
    }

    // 6 haneli OTP üret
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    // 15 dakika geçerli
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    authRepository.deletePasswordResetsByUserId(user.id);
    authRepository.createPasswordReset(user.id, otpCode, expiresAt);

    // E-posta gönder (asenkron yakala ki api beklemesin)
    // GELİŞTİRME AŞAMASI İÇİN: Kodu her zaman terminale yazdır
    console.log(`\n=========================================`);
    console.log(`[OTP KODU ÜRETİLDİ] E-posta: ${email} | Kod: ${otpCode}`);
    console.log(`=========================================\n`);

    try {
      await transporter.sendMail({
        from: `"CineBook Support" <${process.env.SMTP_FROM_EMAIL || 'noreply@cinebook.com'}>`,
        to: email,
        subject: 'CineBook Şifre Sıfırlama Kodu',
        text: `Şifre sıfırlama kodunuz: ${otpCode}\nBu kod 15 dakika boyunca geçerlidir.`,
        html: `<p>Şifre sıfırlama kodunuz: <b>${otpCode}</b></p><p>Bu kod 15 dakika boyunca geçerlidir.</p>`
      });
    } catch (err) {
      console.error('[E-posta Hatası - Gerçek bir SMTP girilmemiş olabilir]:', err.message);
    }

    return { message: successMsg };
  }

  verifyOtp(email, code) {
    const user = authRepository.findUserByEmail(email);
    if (!user) {
      throw new Error('Geçersiz veya süresi dolmuş kod.');
    }

    const resetRecord = authRepository.findPasswordReset(user.id, code);
    if (!resetRecord) {
      throw new Error('Geçersiz veya süresi dolmuş kod.');
    }

    if (new Date(resetRecord.expires_at) < new Date()) {
      throw new Error('Bu kodun süresi dolmuş.');
    }

    return { success: true, message: 'Kod doğrulandı.' };
  }

  resetPassword(email, code, newPassword) {
    const user = authRepository.findUserByEmail(email);
    if (!user) {
      throw new Error('Geçersiz istek.');
    }

    // Doğrula (verifyOtp ile aynı mantık)
    const resetRecord = authRepository.findPasswordReset(user.id, code);
    if (!resetRecord || new Date(resetRecord.expires_at) < new Date()) {
      throw new Error('Geçersiz veya süresi dolmuş kod.');
    }

    // Eski şifre kontrolü
    const isSameAsOld = bcrypt.compareSync(newPassword, user.password_hash);
    if (isSameAsOld) {
      throw new Error('Yeni şifre eski şifrenizle aynı olamaz.');
    }

    // Şifre kuralları
    if (!newPassword || newPassword.length < 8 || newPassword.length > 12) {
      throw new Error('Şifre 8 ile 12 karakter arasında olmalıdır.');
    }
    if (!/[A-Z]/.test(newPassword)) throw new Error('Şifre en az 1 büyük harf içermelidir.');
    if (!/[a-z]/.test(newPassword)) throw new Error('Şifre en az 1 küçük harf içermelidir.');
    if (!/[0-9]/.test(newPassword)) throw new Error('Şifre en az 1 rakam içermelidir.');
    if (!/[<>|!@#$%^&*()_+\-=\[\]{};':"\\,./?~`]/.test(newPassword)) {
      throw new Error('Şifre en az 1 özel karakter içermelidir.');
    }

    // Yeni şifreyi hashle ve kaydet
    const newHash = bcrypt.hashSync(newPassword, 12);
    authRepository.updatePassword(user.id, newHash);
    
    // OTP'yi sil
    authRepository.deletePasswordResetsByUserId(user.id);

    return { success: true, message: 'Şifreniz başarıyla güncellendi.' };
  }
}

module.exports = new AuthService();
