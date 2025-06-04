// documents.js
const express = require('express');
const router = express.Router();
const documentsController = require('../controllers/documentsController');

// /api/documents/patient/:patientId/documents
router.get('/patient/:patientId/documents', documentsController.getPatientDocuments);

// /api/documents/patient/:patientId/notes
router.get('/patient/:patientId/notes', documentsController.getPatientNotes);

module.exports = router;