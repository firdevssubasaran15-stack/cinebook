function requireAdmin(req, res, next) {
  if (!req.user || !req.user.is_admin) {
    return res.status(403).json({ success: false, message: 'Bu işlem için admin yetkisi gereklidir.' });
  }
  next();
}

module.exports = { requireAdmin };
