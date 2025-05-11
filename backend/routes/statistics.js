const express = require('express');
const router = express.Router();
const statisticsController = require('../controllers/statisticsController');

// Pobieranie statystyk wizyt
router.get('/appointments', statisticsController.getAppointmentsStatistics);

// Pobieranie statystyk diagnoz
router.get('/diagnoses', statisticsController.getDiagnosesStatistics);

module.exports = router;