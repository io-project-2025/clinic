const express = require('express');
const router = express.Router();
const patientsController = require('../controllers/patientsController');

// Lista pacjentów lekarza
router.get('/doctor/:doctorId/patients', patientsController.getDoctorPatients);

// Szczegóły pacjenta
router.get('/:patientId', patientsController.getPatientDetails);

module.exports = router;