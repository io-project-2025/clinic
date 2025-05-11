const express = require('express');
const router = express.Router();
const schedulesController = require('../controllers/schedulesController');

// Pobieranie harmonogramów lekarzy
router.get('/', schedulesController.getSchedules); // GET /api/schedules

// Dodawanie harmonogramu lekarza
router.post('/', schedulesController.createSchedule); // POST /api/schedules

// Edytowanie harmonogramu lekarza
router.put('/:scheduleId', schedulesController.updateSchedule); // PUT /api/schedules/:scheduleId

module.exports = router;