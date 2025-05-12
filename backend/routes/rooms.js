const express = require('express');
const router = express.Router();
const roomsController = require('../controllers/roomsController');

// Pobieranie listy pokoi
router.get('/', roomsController.getRooms);

// Dodawanie nowego pokoju
router.post('/', roomsController.createRoom);

// Edytowanie pokoju
router.put('/:roomId', roomsController.updateRoom);

// Usuwanie pokoju
router.delete('/:roomId', roomsController.deleteRoom);

module.exports = router;