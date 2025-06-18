const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { authorizeRole } = require('../middleware/authMiddleware');

router.post('/', authorizeRole(['pacjent']), appointmentController.createAppointment);
router.put('/:id', authorizeRole(['pacjent']), appointmentController.updateAppointment);
router.delete('/:id', authorizeRole(['pacjent']), appointmentController.deleteAppointment);
router.get('/patient/:patientId', authorizeRole(['pacjent']), appointmentController.getPatientAppointments);

module.exports = router;