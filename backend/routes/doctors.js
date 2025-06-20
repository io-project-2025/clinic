const express = require('express');
const router = express.Router();
const doctorsController = require('../controllers/doctorsController');
const { authorizeRole } = require('../middleware/authMiddleware');

// Pobierz wszystkich lekarzy
router.get('/', 
    authorizeRole(['pacjent', 'lekarz', 'admin']), 
    doctorsController.getDoctors
);

// Aktualizuj dane lekarza
router.put('/:doctorId', 
    authorizeRole(['lekarz', 'admin']), 
    doctorsController.updateDoctor
);

// Dodaj nowego lekarza
router.post('/',
    authorizeRole(['admin']), 
    doctorsController.createDoctor
);

// Usuń lekarza
router.delete('/:doctorId',
    authorizeRole(['admin']), 
    doctorsController.deleteDoctor
);

// Pobierz szczegóły konkretnego lekarza
router.get('/:doctorId', 
    authorizeRole(['admin']), 
    doctorsController.getDoctorDetails
);

// Pobierz pacjentów przypisanych do konkretnego lekarza
router.get('/:doctorId/patients', 
  authorizeRole(['lekarz']), 
  doctorsController.getDoctorPatients
);

module.exports = router;
