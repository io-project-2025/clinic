const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authorizeRole } = require('../middleware/authMiddleware');

// Rejestracja pacjenta
router.post('/register', authController.registerPatient);

// Logowanie użytkownika (pacjent, lekarz, admin)
router.post('/login', authController.login);

// Pobranie profilu użytkownika
router.get('/profile', 
    authorizeRole(['pacjent', 'lekarz', 'admin']), 
    authController.getUserProfile
);

// Wylogowanie użytkownika
router.post('/logout', 
    authorizeRole(['pacjent', 'lekarz', 'admin']), 
    authController.logout
);

module.exports = router;
