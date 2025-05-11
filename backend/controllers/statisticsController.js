// Administrator: Statystyki szpitalne
// Obsługuje: GET /api/statistics/appointments, GET /api/statistics/diagnoses

// Pobieranie statystyk wizyt
exports.getAppointmentsStatistics = (req, res) => {
    res.json({ message: 'Statystyki wizyt' });
};

// Pobieranie statystyk diagnoz
exports.getDiagnosesStatistics = (req, res) => {
    res.json({ message: 'Statystyki diagnoz' });
};