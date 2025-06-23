const express = require('express');
const router = express.Router();
const patientsController = require('../controllers/patientsController');
const labResultsController = require('../controllers/labResultsController');
const documentsController = require('../controllers/documentsController');
const { authorizeRole } = require('../middleware/authMiddleware');

// Pobierz szczegóły konkretnego pacjenta
router.get('/:patientId', 
  authorizeRole(['pacjent', 'lekarz']),
  patientsController.getPatientDetails
);

// Pobierz wszystkich pacjentów
router.get('/', 
  authorizeRole(['admin']), 
  patientsController.getAllPatients
);

// Pobierz wyniki badań konkretnego pacjenta
router.get('/:patientId/lab-results', 
  authorizeRole(['pacjent', 'lekarz']), 
  labResultsController.getPatientLabResults
);

// Pobierz szczegóły konkretnego wyniku badań
router.get('/:patientId/lab-results/:resultId', 
  authorizeRole(['pacjent', 'lekarz']), 
  labResultsController.getLabResultDetails
);

// Dokumenty pacjenta
router.get('/:patientId/documents',
  authorizeRole(['pacjent', 'lekarz']),
  documentsController.getPatientDocuments
);

// Notatki pacjenta
router.get('/:patientId/notes',
  authorizeRole(['pacjent', 'lekarz']),
  documentsController.getPatientNotes
);

module.exports = router;