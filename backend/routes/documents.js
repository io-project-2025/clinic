const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');

// Tworzenie e-recepty
router.post('/prescriptions', documentController.createPrescription);

// Tworzenie e-skierowania
router.post('/referrals', documentController.createReferral);

// Pobieranie dokumentów pacjenta
router.get('/:patientId', documentController.getPatientDocuments);

module.exports = router;