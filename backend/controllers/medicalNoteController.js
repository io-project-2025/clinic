// Lekarz: Dokumentacja
// Obsługuje: POST /api/appointments/:id/note, GET /api/patients/:patientId/notes, POST /api/patients/:patientId/medical-history, PUT /api/patients/:patientId/medical-history/:entryId

// Dodaje notatkę do wizyty
exports.addNoteToAppointment = (req, res) => {
    res.json({ message: `Notatka dodana do wizyty ${req.params.id}` });
};

// Pobiera notatki pacjenta
exports.getPatientNotes = (req, res) => {
    res.json([{ id: 1, content: 'Pacjent w dobrym stanie' }]);
};

// Dodaje historię choroby pacjenta
exports.addMedicalHistory = (req, res) => {
    res.json({ message: `Historia choroby dodana dla pacjenta ${req.params.patientId}` });
};

// Aktualizuje historię choroby pacjenta
exports.updateMedicalHistory = (req, res) => {
    res.json({ message: `Historia choroby ${req.params.entryId} zaktualizowana dla pacjenta ${req.params.patientId}` });
};

exports.createMedicalNote = (req, res) => {
    //TODO
}