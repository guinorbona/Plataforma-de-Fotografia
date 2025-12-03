const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/galleryController');
const { isAuthenticated } = require('../middlewares/middlewares');

router.get('/:eventId', isAuthenticated, galleryController.listEventGallery);
router.get('/:eventId/nova', isAuthenticated, galleryController.getAddPhoto);
router.post('/:eventId/nova', isAuthenticated, galleryController.postAddPhoto);
router.get('/:eventId/:photoId/editar', isAuthenticated, galleryController.getEditPhoto);
router.post('/:eventId/:photoId/editar', isAuthenticated, galleryController.postEditPhoto);
router.post('/:eventId/:photoId/excluir', isAuthenticated, galleryController.postDeletePhoto);

module.exports = router;
