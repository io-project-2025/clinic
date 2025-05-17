const express = require('express');
const router = express.Router();
const statisticsController = require('../controllers/statisticsController');

router.get('/appointments', statisticsController.getAppointmentsStatistics);
router.get('/diagnoses', statisticsController.getDiagnosesStatistics);

module.exports = router;