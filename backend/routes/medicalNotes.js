const express = require('express');
const router = express.Router();
const medicalNoteController = require('../controllers/medicalNoteController');

// Dodawanie notatki medycznej do wizyty
router.post('/:appointmentId/note', medicalNoteController.createMedicalNote);

// Pobieranie notatek medycznych pacjenta
router.get('/:patientId/notes', medicalNoteController.getPatientNotes);

module.exports = router;