const express = require('express');
const router = express.Router();
const sharedListsController = require('./shared-lists.controller');
const { authenticateToken } = require('@/shared/middleware/auth.middleware');

router.use(authenticateToken); // Tüm ortak listeler için giriş zorunlu

// Davetiyeler (Sıralama önemli, :id route'undan önce olmalı)
router.get('/invitations', (req, res) => sharedListsController.getPendingInvitations(req, res));

// Temel liste işlemleri
router.post('/', (req, res) => sharedListsController.createList(req, res));
router.get('/', (req, res) => sharedListsController.getMyLists(req, res));
router.get('/user/:userId/public', (req, res) => sharedListsController.getUserPublicLists(req, res));
router.get('/:id', (req, res) => sharedListsController.getListDetails(req, res));
router.put('/:id/visibility', (req, res) => sharedListsController.toggleVisibility(req, res));

// Davet işlemleri
router.post('/:id/invite', (req, res) => sharedListsController.inviteUser(req, res));
router.post('/:id/accept', (req, res) => sharedListsController.acceptInvite(req, res));
router.post('/:id/reject', (req, res) => sharedListsController.rejectInvite(req, res));

// İçerik işlemleri
router.post('/:id/content', (req, res) => sharedListsController.addContent(req, res));

// Kaydetme işlemleri
router.post('/:id/save', (req, res) => sharedListsController.saveList(req, res));
router.delete('/:id/save', (req, res) => sharedListsController.unsaveList(req, res));

module.exports = router;
