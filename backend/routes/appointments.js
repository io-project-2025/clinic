const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { authorizeRole } = require('../middleware/authMiddleware');

router.get('/patient/:patientId', 
    authorizeRole(['pacjent']), 
    appointmentController.getPatientAppointments
);

router.post('/', 
    authorizeRole(['pacjent', 'lekarz']), 
    appointmentController.createAppointment
);

router.put('/:id', 
    authorizeRole(['lekarz']), 
    appointmentController.updateAppointment
);

router.delete('/:id', 
    authorizeRole(['lekarz']), 
    appointmentController.deleteAppointment
);

module.exports = router;