const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { isAuthenticated, isAdmin } = require('../middlewares/middlewares');

router.get('/', isAuthenticated, isAdmin, userController.listUsers);
router.get('/novo', isAuthenticated, isAdmin, userController.getCreateUser);
router.post('/novo', isAuthenticated, isAdmin, userController.postCreateUser);
router.get('/:id/editar', isAuthenticated, isAdmin, userController.getEditUser);
router.post('/:id/editar', isAuthenticated, isAdmin, userController.postEditUser);
router.post('/:id/excluir', isAuthenticated, isAdmin, userController.postDeleteUser);

module.exports = router;
