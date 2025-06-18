const express = require('express');
const router = express.Router();
const labResultsController = require('../controllers/labResultsController');
const { authorizeRole } = require('../middleware/authMiddleware');

router.get('/patients/:patientId/lab-results', authorizeRole(['pacjent', 'lekarz']), labResultsController.getPatientLabResults);
router.get('/lab-results/:resultId', authorizeRole(['pacjent', 'lekarz']), labResultsController.getLabResultDetails);

module.exports = router;