const express = require('express');
const router = express.Router();
const patientsController = require('../controllers/patientsController');
const { authorizeRole } = require('../middleware/authMiddleware');

router.get('/doctor/:doctorId/patients', 
  authorizeRole(['lekarz']), 
  patientsController.getDoctorPatients
);

router.get('/:patientId', 
  authorizeRole(['pacjent', 'lekarz']), 
  patientsController.getPatientDetails
);

module.exports = router;