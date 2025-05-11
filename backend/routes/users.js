const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

// Tworzenie użytkownika
router.post('/', usersController.createUser);

// Edytowanie użytkownika
router.put('/:userId', usersController.updateUser);

// Usuwanie użytkownika
router.delete('/:userId', usersController.deleteUser);

// Przypisywanie ról
router.patch('/:userId/roles', usersController.assignRole);

module.exports = router;