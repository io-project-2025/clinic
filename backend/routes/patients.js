const express = require('express');
const router = express.Router();
const patientsController = require('../controllers/patientsController');

// GET /api/doctor/:doctorId/patients — lista pacjentów lekarza
router.get('/doctor/:doctorId/patients', patientsController.getDoctorPatients);

// GET /api/patients/:patientId — szczegóły pacjenta
router.get('/:patientId', patientsController.getPatientDetails);

module.exports = router;