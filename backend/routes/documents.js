const express = require('express');
const router = express.Router();
const documentsController = require('../controllers/documentsController');
const { authorizeRole } = require('../middleware/authMiddleware');

router.get('/patient/:patientId/documents', authorizeRole(['pacjent', 'lekarz']), documentsController.getPatientDocuments);
router.get('/patient/:patientId/notes', authorizeRole(['pacjent', 'lekarz']), documentsController.getPatientNotes);

module.exports = router;