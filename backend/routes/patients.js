const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');

// Pobieranie listy pacjentów przypisanych do lekarza
router.get('/', patientController.getPatients);

// Pobieranie szczegółowych informacji o pacjencie
router.get('/:patientId', patientController.getPatientDetails);

module.exports = router;