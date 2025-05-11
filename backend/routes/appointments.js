const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

// Zmiana statusu wizyty
router.patch('/:id/status', appointmentController.updateAppointmentStatus);

// Usuwanie wizyty
router.delete('/:id', appointmentController.deleteAppointment);

// Edytowanie wizyty
router.put('/:id', appointmentController.updateAppointment);

// Tworzenie wizyty
router.post('/', appointmentController.createAppointment);

// Zatwierdzanie wizyty
router.post('/:id/approve', appointmentController.approveAppointment);

module.exports = router;