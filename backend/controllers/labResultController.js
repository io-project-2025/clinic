// Lekarz: Wyniki badań
// Obsługuje: GET /api/patients/:patientId/lab-results, GET /api/lab-results/:resultId

// Pobiera wyniki badań dla pacjenta
exports.getPatientLabResults = (req, res) => {
    res.json([{ id: 1, type: 'Krew', result: 'W normie' }]);
};

// Pobiera szczegóły wyniku badania
exports.getLabResultDetails = (req, res) => {
    res.json({ id: req.params.resultId, type: 'Morfologia', result: 'W normie' });
};
