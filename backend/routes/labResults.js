const express = require('express');
const router = express.Router();
const labResultsController = require('../controllers/labResultsController');

// GET /api/lab-results/patients/:patientId/lab-results
router.get('/patients/:patientId/lab-results', labResultsController.getPatientLabResults);

// GET /api/lab-results/:resultId
router.get('/:resultId', labResultsController.getLabResultDetails);

module.exports = router;