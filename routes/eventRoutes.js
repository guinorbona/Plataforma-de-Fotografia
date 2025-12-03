const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { isAuthenticated } = require('../middlewares/middlewares');

router.get('/', isAuthenticated, eventController.listMyEvents);
router.get('/novo', isAuthenticated, eventController.getCreateEvent);
router.post('/novo', isAuthenticated, eventController.postCreateEvent);
router.get('/:id/editar', isAuthenticated, eventController.getEditEvent);
router.post('/:id/editar', isAuthenticated, eventController.postEditEvent);
router.post('/:id/excluir', isAuthenticated, eventController.postDeleteEvent);

module.exports = router;
