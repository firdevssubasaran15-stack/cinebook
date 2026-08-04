const express = require('express');
const router = express.Router();
const libraryController = require('@/features/library/library.controller');
const { authenticateToken } = require('@/shared/middleware/auth.middleware');

// Belirli bir içeriğin kütüphane istatistiklerini (count) al
router.get('/counts/:contentId', (req, res) => libraryController.getCounts(req, res));

router.use(authenticateToken); // Bütün library uç noktaları için giriş zorunlu

// Kütüphane listesini al
router.get('/', (req, res) => libraryController.getUserLibrary(req, res));

// Belirli bir içeriğin kütüphane durumunu al
router.get('/status/:contentId', (req, res) => libraryController.getStatus(req, res));

// Kütüphaneye ekle / durum güncelle
router.post('/:contentId', (req, res) => libraryController.upsert(req, res));

// Kütüphaneden sil
router.delete('/:contentId', (req, res) => libraryController.remove(req, res));

module.exports = router;
