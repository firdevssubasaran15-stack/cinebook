const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const contentController = require('@/features/content/content.controller');
const { authenticateToken } = require('@/shared/middleware/auth.middleware');
const { requireAdmin } = require('@/shared/middleware/admin.middleware');

// Multer storage konfigürasyonu
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Sadece JPEG, PNG veya WebP dosyaları yüklenebilir.'));
    }
  },
});

// GET /api/content/recommendation — Mood'a göre öneriler
router.get('/recommendation', authenticateToken, (req, res) => contentController.getRecommendations(req, res));

// GET /api/content/undiscovered/:mood — Mood'a göre kullanıcının keşfetmediği içerikler
router.get('/undiscovered/:mood', authenticateToken, (req, res) => contentController.getUndiscoveredByMood(req, res));

// GET /api/content/latest — Ana sayfa için
router.get('/latest', authenticateToken, (req, res) => contentController.getLatest(req, res));

// GET /api/content/type/:type — movie, series, book listesi
router.get('/type/:type', authenticateToken, (req, res) => contentController.getByType(req, res));

// GET /api/content/:id — Detay
router.get('/:id', authenticateToken, (req, res) => contentController.getById(req, res));

// POST /api/content — Sadece admin
router.post('/', authenticateToken, requireAdmin, upload.single('cover_image'), (req, res) =>
  contentController.create(req, res)
);

// PUT /api/content/:id — Sadece admin
router.put('/:id', authenticateToken, requireAdmin, upload.single('cover_image'), (req, res) =>
  contentController.update(req, res)
);

// DELETE /api/content/:id — Sadece admin
router.delete('/:id', authenticateToken, requireAdmin, (req, res) =>
  contentController.delete(req, res)
);

module.exports = router;
