const express = require('express');
const router = express.Router();
const messagesController = require('../controllers/messagesController');
const { authorizeRole } = require('../middleware/authMiddleware');

// Pobieranie wiadomości między pacjentem a lekarzem 
router.get('/', 
    authorizeRole(['pacjent', 'lekarz']), 
    messagesController.getMessages
);

// Wysyłanie wiadomości między pacjentem a lekarzem
router.post('/', 
    authorizeRole(['pacjent', 'lekarz']), 
    messagesController.sendMessage
);

module.exports = router;