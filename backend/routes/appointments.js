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

router.put('/:appointmentId', 
    authorizeRole(['pacjent', 'lekarz']), 
    appointmentController.updateAppointment
);

router.delete('/:appointmentId', 
    authorizeRole(['pacjent', 'lekarz']), 
    appointmentController.deleteAppointment
);

router.put('/:appointmentId/documents',
    authorizeRole(['lekarz']),
    appointmentController.updateDocuments
);
  
router.put('/:appointmentId/notes',
    authorizeRole(['lekarz']),
    appointmentController.updateNotes
);

module.exports = router;