const express = require('express');
const router = express.Router();
const doctorsController = require('../controllers/doctorsController');

// Pobieranie listy lekarzy
router.get('/', doctorsController.getDoctors);

// Dodawanie nowego lekarza
router.post('/', doctorsController.createDoctor);

// Edytowanie lekarza
router.put('/:doctorId', doctorsController.updateDoctor);

// Usuwanie lekarza
router.delete('/:doctorId', doctorsController.deleteDoctor);

module.exports = router;