const jwt = require('jsonwebtoken');
const { dbGet } = require('@/database/db');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Erişim tokeni gerekli.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = dbGet('SELECT id, username, email, is_admin FROM users WHERE id = ?', [decoded.id]);

    if (!user) {
      return res.status(401).json({ success: false, message: 'Kullanıcı bulunamadı.' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ success: false, message: 'Geçersiz veya süresi dolmuş token.' });
  }
}

function optionalAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = dbGet('SELECT id, username, email, is_admin FROM users WHERE id = ?', [decoded.id]);
    req.user = user || null;
  } catch (err) {
    req.user = null;
  }
  next();
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.is_admin !== 1) {
    return res.status(403).json({ success: false, message: 'Bu işlem için admin yetkisi gereklidir.' });
  }
  next();
}

module.exports = { authenticateToken, optionalAuth, requireAdmin };
