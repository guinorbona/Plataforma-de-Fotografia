const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { isAuthenticated } = require('../middlewares/middlewares');

router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);

router.get('/register', authController.getRegister);
router.post('/register', authController.postRegister);

router.post('/logout', authController.logout);

router.get('/alterar-senha', isAuthenticated, authController.getChangePassword);
router.post('/alterar-senha', isAuthenticated, authController.postChangePassword);

module.exports = router;
