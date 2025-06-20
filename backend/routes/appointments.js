const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { authorizeRole } = require('../middleware/authMiddleware');

// Pobierz wszystkie wizyty
router.get('/patient/:patientId',
    authorizeRole(['pacjent']), 
    appointmentController.getPatientAppointments
);

// Stwórz nową wizytę
router.post('/', 
    authorizeRole(['pacjent', 'lekarz']), 
    appointmentController.createAppointment
);

// Zaktualizuj szczegóły wizyty
router.put('/:appointmentId', 
    authorizeRole(['pacjent', 'lekarz']), 
    appointmentController.updateAppointment
);

// Usuń wizytę
router.delete('/:appointmentId', 
    authorizeRole(['pacjent', 'lekarz']), 
    appointmentController.deleteAppointment
);

// Zaktualizuj dokumenty wizyty
router.put('/:appointmentId/documents',
    authorizeRole(['lekarz']),
    appointmentController.updateDocuments
);
  
// Zaktualizuj notatki wizyty
router.put('/:appointmentId/notes',
    authorizeRole(['lekarz']),
    appointmentController.updateNotes
);

// Oceń wizytę
router.post('/:appointmentId/rate', 
    authorizeRole(['pacjent']), 
    appointmentController.rateAppointment
);


module.exports = router;