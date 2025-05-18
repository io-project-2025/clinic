const express = require('express');
const router = express.Router();
const documentsController = require('../controllers/documentsController');

// GET /api/patients/:patientId/documents
router.get('/:patientId/documents', documentsController.getPatientDocuments);

module.exports = router;