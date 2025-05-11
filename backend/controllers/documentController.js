// Lekarz: Recepty & Skierowania
// Obsługuje: POST /api/prescriptions, POST /api/referrals, GET /api/patients/:patientId/documents

// Wystawianie recepty
exports.createPrescription = (req, res) => {
    res.json({ message: 'E-recepta wystawiona' });
};

// Tworzenie skierowania
exports.createReferral = (req, res) => {
    res.json({ message: 'E-skierowanie wystawione' });
};

// Pobieranie dokumentów pacjenta
exports.getPatientDocuments = (req, res) => {
    res.json([{ id: 1, type: 'e-recepta', content: 'Paracetamol 500mg' }]);
};