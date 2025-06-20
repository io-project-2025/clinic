const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { authorizeRole } = require('../middleware/authMiddleware');

// Pobierz wszystkie wizyty
router.get('/patient/:patientId',
    authorizeRole(['pacjent']), 
    appointmentController.getPatientAppointments
);

// Stwórz nową wizytę - domyślny status to 'zaplanowana'
router.post('/', 
    authorizeRole(['pacjent', 'lekarz']), 
    appointmentController.createAppointment
);

// Anulowanie wizyty
router.put('/:appointmentId/cancel', 
    authorizeRole(['lekarz', 'pacjent']), 
    appointmentController.cancelAppointment
);

// Oznaczenie wizyty jako zrealizowana
router.put('/:appointmentId/done', 
    authorizeRole(['lekarz']), 
    appointmentController.markAppointmentDone
);

// Oznaczenie wizyty jako nieobecność pacjenta
router.put('/:appointmentId/no-show', 
    authorizeRole(['lekarz']), 
    appointmentController.markNoShow
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