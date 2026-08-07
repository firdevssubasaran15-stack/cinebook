require('module-alias/register');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const { initDb } = require('@/database/db');

const app = express();

// ─── Middleware ────────────────────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Static dosyalar (kapak resimleri) ────────────────────────
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ─── Routes ───────────────────────────────────────────────────
app.use('/api/auth', require('@/features/auth/auth.routes'));
app.use('/api/content', require('@/features/content/content.routes'));
app.use('/api/comments', require('@/features/comments/comments.routes'));
app.use('/api/feelings', require('@/features/feelings/feelings.routes'));
app.use('/api/users', require('@/features/users/users.routes'));
app.use('/api/admin', require('@/features/admin/admin.routes'));
app.use('/api/library', require('@/features/library/library.routes'));
app.use('/api/shared-lists', require('@/features/shared-lists/shared-lists.routes'));
app.use('/api/calendar', require('@/features/calendar/calendar.routes'));
app.use('/api/notifications', require('@/features/notifications/notifications.routes'));

// ─── Health Check ─────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'CineBook API çalışıyor 🎬', timestamp: new Date().toISOString() });
});

// ─── 404 Handler ──────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint bulunamadı.' });
});

// ─── Global Error Handler ─────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Sunucu hatası:', err);
  
  if (err.message && (err.message.includes('Sadece resim') || err.name === 'MulterError')) {
    return res.status(400).json({ success: false, message: err.message });
  }

  res.status(500).json({ success: false, message: 'Sunucu hatası oluştu.' });
});

// ─── Start Server ─────────────────────────────────────────────
const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await initDb();
    console.log('✅ Veritabanı başlatıldı.');
    
    // Start Push Notification Cron Jobs
    const pushCronService = require('@/features/notifications/push-cron.service');
    pushCronService.start();

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`\n🚀 CineBook API sunucusu başlatıldı`);
      console.log(`   → Local:   http://localhost:${PORT}`);
      console.log(`   → Health:  http://localhost:${PORT}/api/health\n`);
    });
  } catch (err) {
    console.error('❌ Sunucu başlatılamadı:', err);
    process.exit(1);
  }
}

startServer();
module.exports = app;
