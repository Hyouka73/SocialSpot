const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const preferencesController = require('../controllers/preferencesController');
const friendsController = require('../controllers/friendsController');

// Rutas de autenticación
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/profile/:userId', authController.getProfile);
router.delete('/:userId', authController.deleteAccount);

// Rutas de preferencias
router.post('/create-preferences/:userId', preferencesController.createPreferences);
router.put('/preferences/:userId', preferencesController.updatePreferences);
router.get('/preferences/:userId', preferencesController.getPreferences);

// Rutas de amigos
router.post('/friends/:userId', friendsController.addFriend);

module.exports = router;