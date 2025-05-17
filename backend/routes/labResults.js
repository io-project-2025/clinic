const express = require('express');
const router = express.Router();
const labResultsController = require('../controllers/labResultsController');

// GET /api/patients/:patientId/lab-results
router.get('/patients/:patientId/lab-results', labResultsController.getPatientLabResults);

// GET /api/lab-results/:resultId
router.get('/lab-results/:resultId', labResultsController.getLabResultDetails);

module.exports = router;