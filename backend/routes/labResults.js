const express = require('express');
const router = express.Router();
const labResultController = require('../controllers/labResultController');

// Pobieranie wyników badań pacjenta
router.get('/:patientId', labResultController.getPatientLabResults);

// Pobieranie szczegółów wyniku konkretnego badania
router.get('/:resultId', labResultController.getLabResultDetails);

module.exports = router;