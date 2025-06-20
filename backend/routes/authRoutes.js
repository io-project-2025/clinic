const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authorizeRole } = require('../middleware/authMiddleware');

router.post('/register', authController.registerPatient);
router.post('/login', authController.login);
router.get('/profile', authorizeRole(['pacjent', 'lekarz', 'admin']), authController.getUserProfile);
router.post('/logout', authorizeRole(['pacjent', 'lekarz', 'admin']), authController.logout);

module.exports = router;
